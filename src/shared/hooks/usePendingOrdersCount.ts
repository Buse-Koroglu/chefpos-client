import { useQueries } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const REFETCH_TIME = 20_000 // 20 saniyede bir veri çekilir güncel veri olması için
const ORDER_TYPES = ['CASHIER', 'SELF_SERVICE'] as const // kasa ekranında bekleyen sipriş tipleri kasiyer tarafından alınan ve self service verilen siparişlerdir

export type PendingOrdersCountTab = 'PREPARING' | 'AWAITING_PAYMENT'  // hazırlanma aşamasında olan v ödeme bekleyen sipariş sayıları

export function usePendingOrdersCount(locationId: string | undefined, tab: PendingOrdersCountTab) {
  const statusParams = tab === 'PREPARING' ? { status: 'PENDING' as const } : { status: 'COMPLETED' as const, paymentStatus: 'UNPAID' as const }

  const queries = useQueries({
    queries: ORDER_TYPES.map((type) => ({
      queryKey: ['orders', 'pending-count', tab, type, locationId], 
      queryFn: () => getOrders({ locationId: locationId!, ...statusParams, type, pageNumber: 1, pageSize: 1 }), // total count için
      enabled: Boolean(locationId), 
      refetchInterval: REFETCH_TIME,
    })),
  })

  const isLoading = queries.some((query) => query.isLoading)
  const total = queries.reduce((sum, query) => sum + (query.data?.totalCount ?? 0), 0) // cashier + self service sipariş sayısı

  return { total, isLoading }
}
