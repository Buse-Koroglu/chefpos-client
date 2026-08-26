import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'
import { STOCK_REQUESTS_PAGE_SIZE } from '@/features/admin-stock-requests/constants'
import type { StockRequestStatusFilter } from '@/features/admin-stock-requests/types'

export function usePagedStockRequestsAdmin(
  searchTerm: string,
  locationId: string,
  status: StockRequestStatusFilter,
  pageNumber: number,
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: ['stockRequests', 'admin', searchTerm, locationId, status, pageNumber, startDate, endDate],
    queryFn: () =>
      getStockRequestsPaged({
        searchTerm: searchTerm || undefined,
        locationId: locationId === 'ALL' ? undefined : locationId,
        status: status === 'ALL' ? undefined : status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        pageNumber,
        pageSize: STOCK_REQUESTS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
