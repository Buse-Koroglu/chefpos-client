import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20

interface UsePreparingOrdersParams {
  locationId: string | undefined
  pageNumber: number
  searchTerm: string
}

export function usePreparingOrders({
  locationId,
  pageNumber,
  searchTerm,
}: UsePreparingOrdersParams) {
  return useQuery({
    queryKey: [
      'orders',
      'preparing',
      locationId,
      searchTerm,
      pageNumber,
    ],

    queryFn: () =>
      getOrders({
        locationId: locationId!,
        status: 'PENDING',
        type: 'WAITER',
        searchTerm,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),

    enabled: Boolean(locationId),

    refetchInterval: 20_000,

    placeholderData: keepPreviousData,
  })
}