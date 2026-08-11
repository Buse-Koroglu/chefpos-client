import { apiClient } from '@/shared/api/client'
import type { CashierDashboardResponse, WeeklyRevenueResponse } from '@/shared/types/cashier-dashboard'

export function getCashierDashboard(locationId: string) {
  return apiClient
    .get<CashierDashboardResponse>('/api/dashboard/cashier', { params: { locationId } })
    .then((res) => res.data)
}

export function getWeeklyRevenue(locationId: string) {
  return apiClient
    .get<WeeklyRevenueResponse>('/api/dashboard/weekly-revenue', { params: { locationId } })
    .then((res) => res.data)
}
