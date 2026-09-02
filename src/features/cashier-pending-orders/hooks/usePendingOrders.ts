import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20
const REFETCH_TIME = 10_000

export type PendingOrdersTab = 'PREPARING' | 'AWAITING_PAYMENT'

export function usePendingOrders(locationId: string | undefined, tab: PendingOrdersTab, pageNumber: number) {
  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
  const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  return useQuery({
    queryKey: ['orders', 'pending', tab, locationId, pageNumber, fromDate],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        ...(tab === 'PREPARING' ? { status: 'PENDING' as const, type: 'CASHIER' as const }  : { status: 'COMPLETED' as const, paymentStatus: 'UNPAID' as const }),
        fromDate,
        toDate,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    refetchInterval: REFETCH_TIME,
    placeholderData: keepPreviousData,
  })
}
