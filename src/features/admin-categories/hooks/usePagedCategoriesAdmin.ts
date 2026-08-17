import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCategoriesAdmin } from '@/shared/api/endpoints/categories'
import { CATEGORIES_PAGE_SIZE } from '@/features/admin-categories/constants'
import type { CategoryStatusFilter } from '@/features/admin-categories/types'

function toIsActiveParam(status: CategoryStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedCategoriesAdmin(
  searchTerm: string,
  locationId: string,
  status: CategoryStatusFilter,
  pageNumber: number,
) {
  return useQuery({
    queryKey: ['categories', 'admin', searchTerm, locationId, status, pageNumber],
    queryFn: () =>
      getCategoriesAdmin({
        searchTerm: searchTerm || undefined,
        locationId: locationId === 'ALL' ? undefined : locationId,
        isActive: toIsActiveParam(status),
        pageNumber,
        pageSize: CATEGORIES_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
