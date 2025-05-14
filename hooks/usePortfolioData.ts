import { useState, useEffect } from 'react';
import { PortfolioDto } from '../types';
import { portfolioService } from '../services/portfolio.service';
import { useAuth } from './useAuth';

export function usePortfolioData(portfolioId: string) {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const result = await portfolioService.getPortfolio(
          portfolioId,
          user.id
        );
        setData(result);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch portfolio data')
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
