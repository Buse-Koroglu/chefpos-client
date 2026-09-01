import { useQuery } from '@tanstack/react-query'

import { getStockManagerDashboardStats } from '@/shared/api/endpoints/stockManagerDashboard'

const REFETCH_TIME = 45_000 // 45 saniyede refetch

export function useStockManagerDashboardStats(locationId: string | undefined) {
  return useQuery({
    queryKey: ['stock-manager-dashboard', 'stats', locationId],
    queryFn: () => getStockManagerDashboardStats(locationId!),
    enabled: Boolean(locationId),
    refetchInterval: REFETCH_TIME,
  })
}
