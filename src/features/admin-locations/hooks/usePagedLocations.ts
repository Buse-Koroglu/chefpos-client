import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getLocationsPaged } from '@/shared/api/endpoints/locations'
import { LOCATIONS_PAGE_SIZE } from '@/features/admin-locations/constants'
import type { LocationStatusFilter } from '@/features/admin-locations/types'

function toIsActiveParam(status: LocationStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedLocations(searchTerm: string, status: LocationStatusFilter, pageNumber: number) {
  return useQuery({
    queryKey: ['locations', 'paged', searchTerm, status, pageNumber],
    queryFn: () =>
      getLocationsPaged({
        searchTerm: searchTerm || undefined,
        isActive: toIsActiveParam(status),
        pageNumber,
        pageSize: LOCATIONS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
