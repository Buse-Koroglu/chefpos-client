import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import { getKitchenOrders } from '@/shared/api/endpoints/orders'
import type { OrderType } from '@/shared/types/order'

const PAGE_SIZE = 20
const REFETCH_TIME = 20_000

export type KitchenOrdersTab = 'WAITER' | 'CASHIER'

const TAB_TYPES: Record<KitchenOrdersTab, OrderType[]> = {
  WAITER: ['WAITER', 'SELF_SERVICE'],
  CASHIER: ['CASHIER'],
}

interface UsePreparingOrdersParams {
  locationId: string | undefined
  tab: KitchenOrdersTab
  pageNumber: number
  searchTerm: string
}

export function usePreparingOrders({
  locationId,
  tab,
  pageNumber,
  searchTerm,
}: UsePreparingOrdersParams) {
  return useQuery({
    queryKey: [
      'orders',
      'kitchen',
      tab,
      locationId,
      searchTerm,
      pageNumber,
    ],

    queryFn: () =>
      getKitchenOrders({
        locationId: locationId!,
        status: 'PENDING',
        types: TAB_TYPES[tab],
        searchTerm,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),

    enabled: Boolean(locationId),

    refetchInterval: REFETCH_TIME,

    placeholderData: keepPreviousData,
  })
}
