import { Database } from "../db/database.types";

// Base Database Types - used for reference in our DTOs
type DbPortfolio = Database["public"]["Tables"]["portfolios"]["Row"];
type DbPortfolioGroup = Database["public"]["Tables"]["portfolio_groups"]["Row"];
type DbPosition = Database["public"]["Tables"]["positions"]["Row"];
type DbTransaction = Database["public"]["Tables"]["transactions"]["Row"];
type DbPriceAlert = Database["public"]["Tables"]["price_alerts"]["Row"];
type DbPortfolioCoin = Database["public"]["Tables"]["portfolio_coins"]["Row"];
type DbPortfolioSummary =
  Database["public"]["Views"]["portfolio_summary"]["Row"];

// ========== Portfolio DTOs ==========

export interface PortfolioDto
  extends Pick<DbPortfolio, "id" | "name" | "description"> {
  createdAt: string;
  updatedAt: string;
  summary?: PortfolioSummaryDto;
}

export interface PortfolioSummaryDto {
  totalPositions: DbPortfolioSummary["total_positions"];
  totalInvested: DbPortfolioSummary["total_invested"];
  currentValue: DbPortfolioSummary["current_value"];
}

export interface PortfolioListItemDto
  extends Pick<DbPortfolio, "id" | "name" | "description"> {
  summary: PortfolioSummaryDto;
}

// Portfolio Commands
export interface CreatePortfolioCommand {
  name: string;
  description?: string | null;
}

export interface UpdatePortfolioCommand {
  name?: string;
  description?: string | null;
}

// ========== Portfolio Coin DTOs ==========

export interface PortfolioCoinDto
  extends Pick<
    DbPortfolioCoin,
    "id" | "ticker" | "type" | "amount" | "price" | "currency" | "total_price"
  > {
  portfolioId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioCoinListItemDto
  extends Pick<
    DbPortfolioCoin,
    "id" | "ticker" | "type" | "amount" | "price" | "currency" | "total_price"
  > {
  timestamp: string;
}

// Portfolio Coin Commands
export interface CreatePortfolioCoinCommand {
  ticker: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  currency: "USD" | "USDT" | "USDC";
  timestamp: string;
}

export interface UpdatePortfolioCoinCommand {
  ticker?: string;
  type?: "buy" | "sell";
  amount?: number;
  price?: number;
  currency?: "USD" | "USDT" | "USDC";
  timestamp?: string;
}

// ========== Portfolio Group DTOs ==========

export interface PortfolioGroupDto
  extends Pick<DbPortfolioGroup, "id" | "name" | "description"> {
  portfolioId: string;
  createdAt: string;
  updatedAt: string;
  positions?: PositionDto[];
}

export interface PortfolioGroupListItemDto
  extends Pick<DbPortfolioGroup, "id" | "name" | "description"> {
  positionCount?: number;
}

// Portfolio Group Commands
export interface CreatePortfolioGroupCommand {
  portfolioId: string;
  name: string;
  description?: string | null;
}

export interface UpdatePortfolioGroupCommand {
  name?: string;
  description?: string | null;
}

export interface AddPositionToGroupCommand {
  positionId: string;
}

// ========== Position DTOs ==========

export interface PositionDto
  extends Pick<
    DbPosition,
    | "id"
    | "cryptocurrency_id"
    | "total_amount"
    | "average_buy_price"
    | "break_even_price"
  > {
  portfolioId: string;
  cryptocurrencyName?: string; // From external API
  createdAt: string;
  updatedAt: string;
  // Calculated metrics from PRD
  currentPrice?: number;
  change24h?: number;
  dailyProfit?: number;
  totalInvested?: number;
  currentProfit?: number;
  groups?: PortfolioGroupListItemDto[];
}

export interface PositionListItemDto
  extends Pick<DbPosition, "id" | "cryptocurrency_id" | "total_amount"> {
  cryptocurrencyName?: string;
  currentPrice?: number;
  change24h?: number;
  totalInvested?: number;
  currentProfit?: number;
}

export interface BreakEvenCalculationDto {
  positionId: string;
  cryptocurrencyId: string;
  initialInvestment: number;
  currentValue: number;
  amountToSell: number;
  priceToSell: number;
}

// Position Commands
export interface CreatePositionCommand {
  portfolioId: string;
  cryptocurrencyId: string;
  totalAmount: number;
  averageBuyPrice: number;
  breakEvenPrice?: number | null;
}

export interface UpdatePositionCommand {
  totalAmount?: number;
  averageBuyPrice?: number;
  breakEvenPrice?: number | null;
}

// ========== Transaction DTOs ==========

export interface TransactionDto
  extends Pick<
    DbTransaction,
    | "id"
    | "position_id"
    | "type"
    | "amount"
    | "price"
    | "total_value"
    | "exchange_id"
  > {
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListItemDto
  extends Pick<
    DbTransaction,
    "id" | "type" | "amount" | "price" | "total_value" | "exchange_id"
  > {
  transactionDate: string;
}

// Transaction Commands
export interface CreateTransactionCommand {
  positionId: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  totalValue: number;
  exchangeId: string;
  transactionDate: string;
}

export interface UpdateTransactionCommand {
  type?: "BUY" | "SELL";
  amount?: number;
  price?: number;
  totalValue?: number;
  exchangeId?: string;
  transactionDate?: string;
}

export interface ImportTransactionsCommand {
  portfolioId: string;
  fileFormat: "CSV" | "JSON" | "XLS";
  exchangeId: string;
  file: File; // Browser File object, would need adjustment for Node.js
}

// ========== Price Alert DTOs ==========

export interface PriceAlertDto
  extends Pick<
    DbPriceAlert,
    | "id"
    | "user_id"
    | "position_id"
    | "target_price"
    | "condition"
    | "is_active"
  > {
  createdAt: string;
  updatedAt: string;
}

export interface PriceAlertListItemDto
  extends Pick<
    DbPriceAlert,
    "id" | "target_price" | "condition" | "is_active"
  > {
  cryptocurrencyId?: string;
  cryptocurrencyName?: string;
  createdAt: string;
}

// Price Alert Commands
export interface CreatePriceAlertCommand {
  positionId: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
}

export interface UpdatePriceAlertCommand {
  targetPrice?: number;
  condition?: "ABOVE" | "BELOW";
  isActive?: boolean;
}

// ========== Exchange DTOs ==========

export interface ExchangeDto {
  id: string;
  name: string;
  apiUrl: string;
  isActive: boolean;
}

export interface CryptocurrencyDto {
  id: string;
  name: string;
  symbol: string;
  currentPrice?: number;
  change24h?: number;
  exchangeId: string;
}

export interface PriceDto {
  cryptocurrencyId: string;
  price: number;
  timestamp: string;
  change24h: number;
}

// ========== Pagination and Filtering ==========

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PortfolioFilterParams extends PaginationParams {
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt" | "totalValue";
  sortOrder?: "asc" | "desc";
}

export interface PortfolioCoinFilterParams extends PaginationParams {
  search?: string;
  type?: "buy" | "sell";
  currency?: "USD" | "USDT" | "USDC";
  startDate?: string;
  endDate?: string;
  sortBy?: "timestamp" | "amount" | "price" | "total_price";
  sortOrder?: "asc" | "desc";
}

export interface PositionFilterParams extends PaginationParams {
  search?: string;
  groupId?: string;
  sortBy?: "name" | "totalAmount" | "currentProfit" | "totalInvested";
  sortOrder?: "asc" | "desc";
}

export interface TransactionFilterParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  type?: "BUY" | "SELL";
  sortBy?: "transactionDate" | "amount" | "price";
  sortOrder?: "asc" | "desc";
}

export interface PriceAlertFilterParams extends PaginationParams {
  isActive?: boolean;
  condition?: "ABOVE" | "BELOW";
  sortBy?: "targetPrice" | "createdAt";
  sortOrder?: "asc" | "desc";
}
