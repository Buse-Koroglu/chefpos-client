import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTablesPaged } from '@/shared/api/endpoints/tables'
import { TABLES_PAGE_SIZE } from '@/features/admin-tables/constants'
import type { TableStatusFilter } from '@/features/admin-tables/types'

function toIsActiveParam(status: TableStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedTablesAdmin(
  searchTerm: string,
  locationId: string,
  status: TableStatusFilter,
  pageNumber: number,
) {
  return useQuery({
    queryKey: ['tables', 'admin', searchTerm, locationId, status, pageNumber],
    queryFn: () =>
      getTablesPaged({
        searchTerm: searchTerm || undefined,
        locationId: locationId === 'ALL' ? undefined : locationId,
        isActive: toIsActiveParam(status),
        pageNumber,
        pageSize: TABLES_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
