import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/endpoints/orders'
import { useAuthStore } from '@/shared/stores/authStore'
import type { PaymentFilter } from '../types'

const PAGE_SIZE = 20

export function useOrderHistory(locationId: string | undefined, filter: PaymentFilter, pageNumber: number) {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['orders', 'history', userId, locationId, filter, pageNumber],
    queryFn: () =>
      getOrders({
        locationId: locationId!,
        ...(filter === 'ALL' ? {} : { paymentStatus: filter }),
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId && userId),
    placeholderData: keepPreviousData,
  })
}
