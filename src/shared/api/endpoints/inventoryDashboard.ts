import { apiClient } from '@/shared/api/client'

import type { InventoryDashboardStats } from '@/features/inventory-dashboard/types/inventoryDashboard'

export function getInventoryDashboardStats(locationId: string) {
  return apiClient.get<InventoryDashboardStats>('/api/stock-requests/dashboard-stats',
      { params: {
          locationId,
        },
      },)
    .then((response) => response.data)
}