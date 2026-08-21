import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'
import { STOCK_MANAGER_REQUESTS_PAGE_SIZE } from '../constants'

export function useStockManagerPastRequests(locationId: string | undefined, searchTerm: string, pageNumber: number) {
  return useQuery({
    queryKey: ['stockRequests', 'stock-manager', 'past', locationId, searchTerm, pageNumber],
    queryFn: () =>
      getStockRequestsPaged({
        locationId,
        searchTerm: searchTerm || undefined,
        onlyHistory: true,
        pageNumber,
        pageSize: STOCK_MANAGER_REQUESTS_PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
