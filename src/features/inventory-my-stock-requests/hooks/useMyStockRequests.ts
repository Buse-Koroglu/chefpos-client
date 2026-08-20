import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'
import type { MyStockRequestsTab } from '../types'

const PAGE_SIZE = 10

export function useMyStockRequests(
  locationId: string | undefined,
  tab: MyStockRequestsTab,
  searchTerm: string,
  pageNumber: number,
) {
  return useQuery({
    queryKey: ['stockRequests', 'my', tab, locationId, searchTerm, pageNumber],
    queryFn: () =>
      getStockRequestsPaged({
        locationId,
        searchTerm: searchTerm || undefined,
        onlyMyRequests: true,
        ...(tab === 'PENDING' ? { status: 'PENDING' as const } : { onlyHistory: true }),
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}