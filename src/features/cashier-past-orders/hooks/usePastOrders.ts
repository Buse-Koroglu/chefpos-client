import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20

export type OrderHistoryFilter = 'PAID' | 'CANCELLED'

export function usePastOrders(locationId: string | undefined, filter: OrderHistoryFilter, pageNumber: number) {
  return useQuery({
    queryKey: ['orders', 'history', locationId, filter, pageNumber],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        ...(filter === 'PAID' ? { paymentStatus: 'PAID' as const } : { status: 'CANCELLED' as const }),
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
