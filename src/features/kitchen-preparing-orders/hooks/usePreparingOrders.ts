import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import { getOrders } from '@/shared/api/endpoints/orders'

const PAGE_SIZE = 20
const REFETCH_INTERVAL_MS = 20_000

export type KitchenOrdersTab = 'WAITER' | 'KIOSK_CASHIER'

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
        // Backend yalnızca tek bir type filtresi kabul ediyor; KIOSK_CASHIER
        // sekmesi CASHIER + SELF_SERVICE birleşimi olduğundan filtresiz çekilip
        // sayfa tarafında WAITER dışlanıyor (bkz. cashier-pending-orders'daki aynı desen).
        ...(tab === 'WAITER' ? { type: 'WAITER' as const } : {}),
        searchTerm,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),

    enabled: Boolean(locationId),

    refetchInterval: REFETCH_INTERVAL_MS,

    placeholderData: keepPreviousData,
  })
}