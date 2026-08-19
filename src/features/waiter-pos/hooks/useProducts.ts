import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProductsPaged } from '@/shared/api/endpoints/products'

export function useProducts(params: {
  locationId: string | undefined
  categoryId?: string
  searchTerm?: string
  pageNumber: number
  pageSize?: number
}) {
  const { locationId, categoryId, searchTerm, pageNumber, pageSize = 20 } = params
  return useQuery({
    queryKey: ['waiter-products', locationId, categoryId, searchTerm, pageNumber],
    queryFn: () =>
      getProductsPaged({
        locationId,
        categoryId,
        searchTerm: searchTerm || undefined,
        isActive: true,
        pageNumber,
        pageSize,
      }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}