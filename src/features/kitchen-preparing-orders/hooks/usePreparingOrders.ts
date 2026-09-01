import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20
const REFETCH_TIME = 20_000

export type KitchenOrdersTab = 'WAITER' | 'CASHIER'

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
      'preparing',
      tab,
      locationId,
      searchTerm,
      pageNumber,
    ],

    queryFn: () =>
      getOrders({
        locationId: locationId!,
        status: 'PENDING',
        ...(tab === 'CASHIER' ? { type: 'CASHIER' as const } : {}),
        searchTerm,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),

    enabled: Boolean(locationId),

    refetchInterval: REFETCH_TIME,

    placeholderData: keepPreviousData,
  })
}