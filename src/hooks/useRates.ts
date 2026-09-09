import { useQuery } from '@tanstack/react-query';
import { fetchRatesData } from '../services/ratesService';

export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: fetchRatesData,
    staleTime: 1000 * 60 * 15, // 15 mins
  });
}
