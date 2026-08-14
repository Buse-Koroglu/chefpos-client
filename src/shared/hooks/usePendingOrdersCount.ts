import { useQueries } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'

const REFETCH_INTERVAL_MS = 20_000
const COUNTED_TYPES = ['CASHIER', 'SELF_SERVICE'] as const

export type PendingOrdersCountTab = 'PREPARING' | 'AWAITING_PAYMENT'

export function usePendingOrdersCount(locationId: string | undefined, tab: PendingOrdersCountTab) {
  const statusParams =
    tab === 'PREPARING'
      ? { status: 'PENDING' as const }
      : { status: 'COMPLETED' as const, paymentStatus: 'UNPAID' as const }

  const queries = useQueries({
    queries: COUNTED_TYPES.map((type) => ({
      queryKey: ['orders', 'pending-count', tab, type, locationId],
      queryFn: () => getOrders({ locationId: locationId!, ...statusParams, type, pageNumber: 1, pageSize: 1 }),
      enabled: Boolean(locationId),
      refetchInterval: REFETCH_INTERVAL_MS,
    })),
  })

  const isLoading = queries.some((query) => query.isLoading)
  const total = queries.reduce((sum, query) => sum + (query.data?.totalCount ?? 0), 0)

  return { total, isLoading }
}
