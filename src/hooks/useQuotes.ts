import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchLiveQuotes, fetchHistoricalFiat } from '../services/quotesService';

export function useQuotes() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('--:--:--');

  const quotesQuery = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const data = await fetchLiveQuotes();
      const now = new Date();
      setLastUpdatedTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
          now.getSeconds()
        ).padStart(2, '0')}`
      );
      return data;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const historicalQuery = useQuery({
    queryKey: ['historicalFiat'],
    queryFn: fetchHistoricalFiat,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    ...quotesQuery,
    historicalData: historicalQuery.data || [],
    lastUpdatedTime,
  };
}
