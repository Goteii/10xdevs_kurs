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

export interface PortfolioMetricsDto {
  totalPositions: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  dailyChange: number;
  dailyChangePercentage: number;
}
