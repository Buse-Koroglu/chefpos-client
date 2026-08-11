export interface BestSellingProductDto {
  productId: string
  productName: string
  totalQuantitySold: number
}

export interface CashierDashboardResponse {
  pendingOrdersCount: number
  todayRevenue: number
  bestSellingProduct: BestSellingProductDto | null
}

export interface DailyRevenueDto {
  date: string
  dayName: string
  revenue: number
}

export interface WeeklyRevenueResponse {
  days: DailyRevenueDto[]
}
