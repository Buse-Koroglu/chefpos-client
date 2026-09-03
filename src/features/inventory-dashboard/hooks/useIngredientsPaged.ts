import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getIngredientsPaged } from '@/shared/api/endpoints/ingredients'

const PAGE_SIZE = 20

export function useIngredientsPaged(locationId: string | undefined, searchTerm: string, pageNumber: number) {
  return useQuery({
    queryKey: ['ingredients', 'paged', locationId, searchTerm, pageNumber],
    queryFn: () =>
      getIngredientsPaged({
        locationId,
        searchTerm: searchTerm || undefined,
        isActive: true,
        pageNumber,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
