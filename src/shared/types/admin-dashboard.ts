export interface DailyRevenueEntry {
  date: string
  profit: number
}

export interface LocationOrderCount {
  locationId: string
  locationName: string
  orderCount: number
}

export interface DashboardSummary {
  totalStaffCount: number
  topSellingProductName: string | null
  weeklyRevenue: DailyRevenueEntry[]
  todayOrdersByLocation: LocationOrderCount[]
}
