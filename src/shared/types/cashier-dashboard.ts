export interface BestSellingProductDto { // en çok satan ürün dto
  productId: string
  productName: string
  totalQuantitySold: number
}

export interface CashierDashboardResponse { // kasiyer paneli dto
  pendingOrdersCount: number
  todayRevenue: number
  bestSellingProduct: BestSellingProductDto | null
}

export interface DailyRevenueDto { // günlük kazanç 
  date: string
  dayName: string
  profit: number
}

export interface WeeklyRevenueResponse { // haftalık kazanç dto
  days: DailyRevenueDto[]
}
