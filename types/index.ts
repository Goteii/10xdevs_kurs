export interface PortfolioDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  summary?: {
    totalPositions: number;
    totalInvested: number;
    currentValue: number;
  };
}

export interface PortfolioListItemDto {
  id: string;
  name: string;
  description: string | null;
  summary: {
    totalPositions: number;
    totalInvested: number;
    currentValue: number;
  };
}

export interface CreatePortfolioCommand {
  name: string;
  description?: string;
}

export interface UpdatePortfolioCommand {
  name?: string;
  description?: string;
}

export interface PortfolioFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PortfolioMetricsDto {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  profitPercentage: number;
  positionsCount: number;
  topPerformingPosition: {
    id: string;
    cryptocurrencyId: string;
    profit: number;
    profitPercentage: number;
  };
  worstPerformingPosition: {
    id: string;
    cryptocurrencyId: string;
    profit: number;
    profitPercentage: number;
  };
}

export interface PositionDto {
  id: string;
  portfolioId: string;
  cryptocurrency_id: string;
  total_amount: number;
  average_buy_price: number;
  break_even_price: number;
  createdAt: string;
  updatedAt: string;
  groups: {
    id: string;
    name: string;
    description: string | null;
  }[];
}

export interface PositionListItemDto {
  id: string;
  cryptocurrency_id: string;
  total_amount: number;
  cryptocurrencyName?: string;
  currentPrice?: number;
  change24h?: number;
  totalInvested?: number;
  currentProfit?: number;
}

export interface CreatePositionCommand {
  cryptocurrencyId: string;
  totalAmount: number;
  averageBuyPrice: number;
  breakEvenPrice: number;
}

export interface UpdatePositionCommand {
  totalAmount: number;
  averageBuyPrice: number;
  breakEvenPrice: number;
}

export interface PositionFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  groupId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BreakEvenCalculationDto {
  breakEvenPrice: number;
  requiredPrice: number;
  priceDifference: number;
  priceDifferencePercentage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CryptocurrencyDto {
  id: string;
  name: string;
  symbol: string;
  exchangeId: string;
} 