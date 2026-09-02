import { useQueries } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const REFETCH_TIME = 10_000 // 10 saniyede bir veri çekilir güncel veri olması için
const PREPARING_ORDER_TYPES = ['CASHIER', 'SELF_SERVICE'] as const // hazırlanan siparişlerde waiter siparişleri sayılmaz
const AWAITING_PAYMENT_ORDER_TYPES = ['CASHIER', 'WAITER', 'SELF_SERVICE'] as const // ödeme bekleyen siparişlerde tüm sipariş tipleri sayılır

export type PendingOrdersCountTab = 'PREPARING' | 'AWAITING_PAYMENT'  // hazırlanma aşamasında olan v ödeme bekleyen sipariş sayıları

export function usePendingOrdersCount(locationId: string | undefined, tab: PendingOrdersCountTab) {
  const statusParams = tab === 'PREPARING' ? { status: 'PENDING' as const } : { status: 'COMPLETED' as const, paymentStatus: 'UNPAID' as const }
  const orderTypes = tab === 'PREPARING' ? PREPARING_ORDER_TYPES : AWAITING_PAYMENT_ORDER_TYPES

  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
  const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  const queries = useQueries({
    queries: orderTypes.map((type) => ({
      queryKey: ['orders', 'pending-count', tab, type, locationId, fromDate],
      queryFn: () => getOrders({ locationId: locationId!, ...statusParams, type, fromDate, toDate, pageNumber: 1, pageSize: 1 }), // total count için
      enabled: Boolean(locationId),
      refetchInterval: REFETCH_TIME,
    })),
  })

  const isLoading = queries.some((query) => query.isLoading)
  const total = queries.reduce((sum, query) => sum + (query.data?.totalCount ?? 0), 0) // cashier + self service sipariş sayısı

  return { total, isLoading }
}
