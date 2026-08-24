import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/shared/api/endpoints/products'

export function useProducts(locationId: string | undefined, categoryId?: string, includeUncategorized?: boolean) {
  return useQuery({
    queryKey: ['products', locationId, categoryId, includeUncategorized],
    queryFn: () => getProducts({ locationId: locationId!, categoryId, includeUncategorized }),
    enabled: Boolean(locationId),
  })
}
