import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProductsPaged } from '@/shared/api/endpoints/products'

export function useProducts(params: {
  locationId: string | undefined
  categoryId?: string
  searchTerm?: string
  pageNumber: number
  pageSize?: number
  includeUncategorized?: boolean
}) {
  const { locationId, categoryId, searchTerm, pageNumber, pageSize = 20, includeUncategorized } = params
  
  return useQuery({
    queryKey: ['cashier-products', locationId, categoryId, searchTerm, pageNumber, pageSize, includeUncategorized],
    queryFn: () =>
      getProductsPaged({locationId,categoryId,searchTerm: searchTerm || undefined,isActive: true,pageNumber,pageSize,includeUncategorized }),
    enabled: Boolean(locationId),
    placeholderData: keepPreviousData,
  })
}
