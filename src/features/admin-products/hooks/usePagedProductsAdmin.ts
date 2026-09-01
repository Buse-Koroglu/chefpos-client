import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProductsPaged } from '@/shared/api/endpoints/products'
import { PRODUCTS_PAGE_SIZE } from '@/features/admin-products/constants'
import type { ProductStatusFilter } from '@/features/admin-products/types'

function toIsActiveParam(status: ProductStatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedProductsAdmin(searchTerm: string,locationId: string,status: ProductStatusFilter,pageNumber: number) {
  return useQuery({
    queryKey: ['products', 'admin', searchTerm, locationId, status, pageNumber],
    queryFn: () =>
      getProductsPaged({
        searchTerm: searchTerm || undefined,
        locationId: locationId === 'ALL' ? undefined : locationId,
        isActive: toIsActiveParam(status),
        pageNumber,
        pageSize: PRODUCTS_PAGE_SIZE,
        includeUncategorized: true,
      }),
    placeholderData: keepPreviousData,
  })
}
