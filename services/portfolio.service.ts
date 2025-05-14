import { supabase } from "../db/supabase";
import { DatabaseError, NotFoundError, ConflictError } from "../lib/errors";
import type {
  PortfolioDto,
  PortfolioListItemDto,
  CreatePortfolioCommand,
  UpdatePortfolioCommand,
  PaginatedResponse,
  PortfolioFilterParams,
  PortfolioMetricsDto,
} from "../types";
import type { Database } from "../db/database.types";
import { api } from "./api";

type DbPortfolio = Database["public"]["Tables"]["portfolios"]["Row"];
type DbPortfolioSummary =
  Database["public"]["Views"]["portfolio_summary"]["Row"];

interface PortfolioWithSummary extends DbPortfolio {
  portfolio_summary: DbPortfolioSummary[];
}

export class PortfolioService {
  async getPortfolios(
    params: PortfolioFilterParams,
    userId: string
  ): Promise<PaginatedResponse<PortfolioListItemDto>> {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    let query = supabase
      .from("portfolios")
      .select("*, portfolio_summary(*)", { count: "exact" })
      .eq("user_id", userId)
      .is("deleted_at", null);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw new DatabaseError("Failed to fetch portfolios");
    }

    return {
      items: (data as PortfolioWithSummary[]).map(
        this.mapToPortfolioListItemDto
      ),
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  async getPortfolio(id: string, userId: string): Promise<PortfolioDto> {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*, portfolio_summary(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("Portfolio not found");
      }
      throw new DatabaseError("Failed to fetch portfolio");
    }

    return this.mapToPortfolioDto(data as PortfolioWithSummary);
  }

  async createPortfolio(
    command: CreatePortfolioCommand,
    userId: string
  ): Promise<PortfolioDto> {
    // Check for duplicate portfolio name
    const { data: existing } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", userId)
      .eq("name", command.name)
      .is("deleted_at", null)
      .single();

    if (existing) {
      throw new ConflictError("Portfolio with this name already exists");
    }

    const { data, error } = await supabase
      .from("portfolios")
      .insert({
        user_id: userId,
        name: command.name,
        description: command.description,
      })
      .select("*, portfolio_summary(*)")
      .single();

    if (error) {
      throw new DatabaseError("Failed to create portfolio");
    }

    return this.mapToPortfolioDto(data as PortfolioWithSummary);
  }

  async updatePortfolio(
    id: string,
    command: UpdatePortfolioCommand,
    userId: string
  ): Promise<PortfolioDto> {
    // Check if portfolio exists and belongs to user
    await this.getPortfolio(id, userId);

    // Check for duplicate name if name is being updated
    if (command.name) {
      const { data: existing } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", userId)
        .eq("name", command.name)
        .neq("id", id)
        .is("deleted_at", null)
        .single();

      if (existing) {
        throw new ConflictError("Portfolio with this name already exists");
      }
    }

    const { data, error } = await supabase
      .from("portfolios")
      .update({
        name: command.name,
        description: command.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, portfolio_summary(*)")
      .single();

    if (error) {
      throw new DatabaseError("Failed to update portfolio");
    }

    return this.mapToPortfolioDto(data as PortfolioWithSummary);
  }

  async deletePortfolio(id: string, userId: string): Promise<void> {
    // Check if portfolio exists and belongs to user
    await this.getPortfolio(id, userId);

    const { error } = await supabase
      .from("portfolios")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new DatabaseError("Failed to delete portfolio");
    }
  }

  private mapToPortfolioDto(dbPortfolio: PortfolioWithSummary): PortfolioDto {
    const summary = dbPortfolio.portfolio_summary[0];
    return {
      id: dbPortfolio.id,
      name: dbPortfolio.name,
      description: dbPortfolio.description,
      createdAt: dbPortfolio.created_at,
      updatedAt: dbPortfolio.updated_at,
      summary: summary
        ? {
            totalPositions: summary.total_positions,
            totalInvested: summary.total_invested,
            currentValue: summary.current_value,
          }
        : undefined,
    };
  }

  private mapToPortfolioListItemDto(
    dbPortfolio: PortfolioWithSummary
  ): PortfolioListItemDto {
    const summary = dbPortfolio.portfolio_summary[0];
    return {
      id: dbPortfolio.id,
      name: dbPortfolio.name,
      description: dbPortfolio.description,
      summary: {
        totalPositions: summary?.total_positions ?? 0,
        totalInvested: summary?.total_invested
          ? Number(summary.total_invested)
          : 0,
        currentValue: summary?.current_value
          ? Number(summary.current_value)
          : 0,
      },
    };
  }

  async getPortfolioMetrics(portfolioId: string): Promise<PortfolioMetricsDto> {
    const response = await api.get<PortfolioMetricsDto>(
      `/portfolio/${portfolioId}/metrics`
    );
    return response.data;
  }
}

export const portfolioService = new PortfolioService();
