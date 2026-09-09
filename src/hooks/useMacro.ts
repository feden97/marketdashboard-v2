import { useQuery } from '@tanstack/react-query';
import { fetchMacroData } from '../services/macroService';

export function useMacro() {
  return useQuery({
    queryKey: ['macro'],
    queryFn: fetchMacroData,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
