import { useState, useEffect } from "react";
import { PortfolioMetricsDto } from "../types/portfolio.types";
import { portfolioService } from "../services/portfolio.service";
import { useAuth } from "./useAuth";

export function usePortfolioMetrics(portfolioId: string) {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioMetricsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const result = await portfolioService.getPortfolioMetrics(portfolioId);
        setData(result as unknown as PortfolioMetricsDto);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch portfolio metrics")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [portfolioId, user?.id]);

  return { data, isLoading, error };
}
