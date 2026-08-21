import { apiClient } from '@/shared/api/client'

import type { StockManagerDashboardStats } from '@/features/stock-manager-dashboard/types'

export function getStockManagerDashboardStats(locationId: string) {
  return apiClient
    .get<StockManagerDashboardStats>('/api/stock-requests/stock-manager-dashboard-stats', {
      params: { locationId },
    })
    .then((response) => response.data)
}
