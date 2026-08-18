import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getIngredientsPaged } from '@/shared/api/endpoints/ingredients'
import { INGREDIENTS_PAGE_SIZE } from '@/features/admin-ingredients/constants'
import type { IngredientStatusFilter } from '@/features/admin-ingredients/types'

function toIsActiveParam(status: IngredientStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedIngredientsAdmin(
  searchTerm: string,
  locationId: string,
  status: IngredientStatusFilter,
  pageNumber: number,
) {
  return useQuery({
    queryKey: ['ingredients', 'admin', searchTerm, locationId, status, pageNumber],
    queryFn: () =>
      getIngredientsPaged({
        searchTerm: searchTerm || undefined,
        locationId: locationId === 'ALL' ? undefined : locationId,
        isActive: toIsActiveParam(status),
        pageNumber,
        pageSize: INGREDIENTS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
