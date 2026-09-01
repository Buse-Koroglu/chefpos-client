import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'
import { useAuthStore } from '@/shared/stores/authStore'
import type { OrderHistoryFilter } from '../types'

const PAGE_SIZE = 20

export function useOrderHistory(locationId: string | undefined, filter: OrderHistoryFilter, pageNumber: number) {
  const userId = useAuthStore((state) => state.user?.id)

  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
  const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  return useQuery({
    queryKey: ['orders', 'history', userId, locationId, filter, fromDate, pageNumber],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        waiterId: userId,
        status: filter,
        fromDate,
        toDate,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId && userId),
    placeholderData: keepPreviousData,
  })
}
