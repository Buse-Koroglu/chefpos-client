import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20
const REFETCH_TIME = 20_000

export type PendingOrdersTab = 'PREPARING' | 'AWAITING_PAYMENT'

export function usePendingOrders(locationId: string | undefined, tab: PendingOrdersTab, pageNumber: number) {
  return useQuery({
    queryKey: ['orders', 'pending', tab, locationId, pageNumber],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        ...(tab === 'PREPARING' ? { status: 'PENDING' as const, type: 'CASHIER' as const }  : { status: 'COMPLETED' as const, paymentStatus: 'UNPAID' as const }),
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    refetchInterval: REFETCH_TIME,
    placeholderData: keepPreviousData,
  })
}
