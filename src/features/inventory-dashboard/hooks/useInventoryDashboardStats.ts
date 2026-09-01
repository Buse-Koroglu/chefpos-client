import { useQuery } from '@tanstack/react-query'

import { getInventoryDashboardStats } from '@/shared/api/endpoints/inventoryDashboard'

const REFETCH_TIME = 45_000 // 45 sn refetch

export function useInventoryDashboardStats(
  locationId: string | undefined,
) {
  return useQuery({
    queryKey: [
      'inventory-dashboard',
      'stats',
      locationId,
    ],

    queryFn: () =>
      getInventoryDashboardStats(locationId!),

    enabled: Boolean(locationId),

    refetchInterval: REFETCH_TIME,
  })
}