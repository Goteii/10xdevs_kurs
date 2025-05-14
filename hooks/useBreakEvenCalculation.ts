import { useState, useEffect } from 'react';
import { BreakEvenCalculationDto } from '../types/position.types';
import { positionService } from '../services/position.service';
import { useAuth } from './useAuth';

export function useBreakEvenCalculation(positionId: string) {
  const { user } = useAuth();
  const [data, setData] = useState<BreakEvenCalculationDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const result = await positionService.getBreakEvenCalculation(
          positionId
        );
        setData(result);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch break even calculation')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [positionId, user?.id]);

  return { data, isLoading, error };
}
