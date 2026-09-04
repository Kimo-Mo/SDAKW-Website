import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

/**
 * Standardized TanStack Query caching and fetching options for SDAKW.
 * Implements a 5-minute staleTime and 30-minute gcTime to ensure fast, responsive
 * client-side navigation without unnecessary network waterfalls.
 */
export const DEFAULT_QUERY_OPTIONS: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false, // Prevents redundant background fetches when switching tabs
    refetchOnReconnect: true,
    retry: 1,
  },
};

/**
 * Factory function creating an isolated, production-tuned QueryClient instance.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: DEFAULT_QUERY_OPTIONS,
  });
}
