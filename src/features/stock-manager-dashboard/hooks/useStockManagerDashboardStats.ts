import { useQuery } from '@tanstack/react-query'

import { getStockManagerDashboardStats } from '@/shared/api/endpoints/stockManagerDashboard'

const REFETCH_INTERVAL_MS = 30_000

export function useStockManagerDashboardStats(locationId: string | undefined) {
  return useQuery({
    queryKey: ['stock-manager-dashboard', 'stats', locationId],
    queryFn: () => getStockManagerDashboardStats(locationId!),
    enabled: Boolean(locationId),
    refetchInterval: REFETCH_INTERVAL_MS,
  })
}
