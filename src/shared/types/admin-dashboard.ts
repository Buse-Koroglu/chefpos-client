export interface DailyRevenueDto {
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
  weeklyRevenue: DailyRevenueDto[]
  todayOrdersByLocation: LocationOrderCount[]
}
