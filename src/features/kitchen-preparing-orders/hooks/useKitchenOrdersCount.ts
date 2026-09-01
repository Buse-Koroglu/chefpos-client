import { useQueries } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'
import type { OrderType } from '@/shared/types/order'

const REFETCH_TIME = 20_000

const TAB_TYPES: Record<'WAITER' | 'CASHIER', OrderType[]> = {
  WAITER: ['WAITER', 'SELF_SERVICE'],
  CASHIER: ['CASHIER'],
}

export function useKitchenOrdersCount(locationId: string | undefined) {
  const types = [...TAB_TYPES.WAITER, ...TAB_TYPES.CASHIER]

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
      refetchInterval: REFETCH_TIME,
    })),
  })

  const countByType = new Map(types.map((type, index) => [type, queries[index].data?.totalCount ?? 0]))

  const waiterCount = (countByType.get('WAITER') ?? 0) + (countByType.get('SELF_SERVICE') ?? 0)
  const cashierCount = countByType.get('CASHIER') ?? 0
  const isLoading = queries.some((query) => query.isLoading)

  return { waiterCount, cashierCount, isLoading }
}
