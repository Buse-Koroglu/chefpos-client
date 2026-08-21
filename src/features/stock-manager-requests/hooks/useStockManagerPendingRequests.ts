import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'
import { STOCK_MANAGER_REQUESTS_PAGE_SIZE } from '../constants'

export function useStockManagerPendingRequests(locationId: string | undefined, searchTerm: string, pageNumber: number) {
  return useQuery({
    queryKey: ['stockRequests', 'stock-manager', 'pending', locationId, searchTerm, pageNumber],
    queryFn: () =>
      getStockRequestsPaged({
        locationId,
        searchTerm: searchTerm || undefined,
        status: 'PENDING',
        pageNumber,
        pageSize: STOCK_MANAGER_REQUESTS_PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
