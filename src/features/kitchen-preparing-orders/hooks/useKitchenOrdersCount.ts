import { useQueries } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'
import type { OrderType } from '@/shared/types/order'

const REFETCH_INTERVAL_MS = 20_000

const TYPES_BY_TAB: Record<'WAITER' | 'KIOSK_CASHIER', OrderType[]> = {
  WAITER: ['WAITER'],
  KIOSK_CASHIER: ['CASHIER', 'SELF_SERVICE'],
}

export function useKitchenOrdersCount(locationId: string | undefined) {
  const types = [...TYPES_BY_TAB.WAITER, ...TYPES_BY_TAB.KIOSK_CASHIER]

  const queries = useQueries({
    queries: types.map((type) => ({
      queryKey: ['orders', 'kitchen-count', type, locationId],
      queryFn: () =>
        getOrders({
          locationId: locationId!,
          status: 'PENDING',
          type,
          pageNumber: 1,
          pageSize: 1,
        }),
      enabled: Boolean(locationId),
      refetchInterval: REFETCH_INTERVAL_MS,
    })),
  })

  const countByType = new Map(types.map((type, index) => [type, queries[index].data?.totalCount ?? 0]))

  const waiterCount = countByType.get('WAITER') ?? 0
  const kioskCashierCount = (countByType.get('CASHIER') ?? 0) + (countByType.get('SELF_SERVICE') ?? 0)
  const isLoading = queries.some((query) => query.isLoading)

  return { waiterCount, kioskCashierCount, isLoading }
}
