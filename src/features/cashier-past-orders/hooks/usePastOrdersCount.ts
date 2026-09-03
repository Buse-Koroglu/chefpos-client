import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'
import type { OrderHistoryFilter } from './usePastOrders'

export function usePastOrdersCount(locationId: string | undefined, filter: OrderHistoryFilter) {
  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
  const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  const { data } = useQuery({
    queryKey: ['orders', 'history-count', locationId, filter, fromDate],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        ...(filter === 'PAID' ? { paymentStatus: 'PAID' as const } : { status: 'CANCELLED' as const }),
        fromDate,
        toDate,
        pageNumber: 1,
        pageSize: 1,
      }),
    enabled: Boolean(locationId),
  })

  return data?.totalCount ?? 0
}
