import { supabase } from "../db/supabase";
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../lib/errors";
import type {
  PositionDto,
  PositionListItemDto,
  CreatePositionCommand,
  UpdatePositionCommand,
  PaginatedResponse,
  PositionFilterParams,
  BreakEvenCalculationDto,
} from "../types";
import type { Database } from "../db/database.types";
import { api } from "./api";

type DbPosition = Database["public"]["Tables"]["positions"]["Row"];
type DbPortfolioGroup = Database["public"]["Tables"]["portfolio_groups"]["Row"];

interface PositionWithGroups extends DbPosition {
  groups: {
    group: DbPortfolioGroup;
  }[];
}

export class PositionService {
  async getPositions(
    portfolioId: string,
    params: PositionFilterParams,
    userId: string
  ): Promise<PaginatedResponse<PositionListItemDto>> {
    const {
      page = 1,
      pageSize = 10,
      search,
      groupId,
      sortBy = "total_amount",
      sortOrder = "desc",
    } = params;

    // Verify portfolio ownership
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found");
    }

    let query = supabase
      .from("positions")
      .select("*, groups:position_groups(group:portfolio_groups(*))", {
        count: "exact",
      })
      .eq("portfolio_id", portfolioId)
      .is("deleted_at", null);

    if (search) {
      query = query.ilike("cryptocurrency_id", `%${search}%`);
    }

    if (groupId) {
      query = query.eq("position_groups.group_id", groupId);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw new DatabaseError("Failed to fetch positions");
    }

    return {
      items: (data as PositionWithGroups[]).map(this.mapToPositionListItemDto),
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  async createPosition(
    portfolioId: string,
    command: CreatePositionCommand,
    userId: string
  ): Promise<PositionDto> {
    // Verify portfolio ownership
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found");
    }

    // Check for duplicate cryptocurrency in portfolio
    const { data: existing } = await supabase
      .from("positions")
      .select("id")
      .eq("portfolio_id", portfolioId)
      .eq("cryptocurrency_id", command.cryptocurrencyId)
      .is("deleted_at", null)
      .single();

    if (existing) {
      throw new ConflictError(
        "Position for this cryptocurrency already exists in the portfolio"
      );
    }

    const { data, error } = await supabase
      .from("positions")
      .insert({
        portfolio_id: portfolioId,
        cryptocurrency_id: command.cryptocurrencyId,
        total_amount: command.totalAmount,
        average_buy_price: command.averageBuyPrice,
        break_even_price: command.breakEvenPrice,
      })
      .select("*, groups:position_groups(group:portfolio_groups(*))")
      .single();

    if (error) {
      throw new DatabaseError("Failed to create position");
    }

    return this.mapToPositionDto(data as PositionWithGroups);
  }

  async updatePosition(
    id: string,
    command: UpdatePositionCommand,
    userId: string
  ): Promise<PositionDto> {
    // Verify position ownership through portfolio
    const { data: position } = await supabase
      .from("positions")
      .select("portfolio_id")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (!position) {
      throw new NotFoundError("Position not found");
    }

    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("id", position.portfolio_id)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();

    if (!portfolio) {
      throw new ForbiddenError("Access denied");
    }

    const { data, error } = await supabase
      .from("positions")
      .update({
        total_amount: command.totalAmount,
        average_buy_price: command.averageBuyPrice,
        break_even_price: command.breakEvenPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, groups:position_groups(group:portfolio_groups(*))")
      .single();

    if (error) {
      throw new DatabaseError("Failed to update position");
    }

    return this.mapToPositionDto(data as PositionWithGroups);
  }

  private mapToPositionDto(dbPosition: PositionWithGroups): PositionDto {
    return {
      id: dbPosition.id,
      portfolioId: dbPosition.portfolio_id,
      cryptocurrency_id: dbPosition.cryptocurrency_id,
      total_amount: dbPosition.total_amount,
      average_buy_price: dbPosition.average_buy_price,
      break_even_price: dbPosition.break_even_price,
      createdAt: dbPosition.created_at,
      updatedAt: dbPosition.updated_at,
      groups: dbPosition.groups.map((group) => ({
        id: group.group.id,
        name: group.group.name,
        description: group.group.description,
      })),
    };
  }

  private mapToPositionListItemDto(
    dbPosition: PositionWithGroups
  ): PositionListItemDto {
    return {
      id: dbPosition.id,
      cryptocurrency_id: dbPosition.cryptocurrency_id,
      total_amount: dbPosition.total_amount,
      // These fields would typically be populated from an external API
      cryptocurrencyName: undefined,
      currentPrice: undefined,
      change24h: undefined,
      totalInvested: undefined,
      currentProfit: undefined,
    };
  }

  async getBreakEvenCalculation(
    positionId: string
  ): Promise<BreakEvenCalculationDto> {
    const response = await api.get<BreakEvenCalculationDto>(
      `/positions/${positionId}/break-even`
    );
    return response.data;
  }
}

export const positionService = new PositionService();
