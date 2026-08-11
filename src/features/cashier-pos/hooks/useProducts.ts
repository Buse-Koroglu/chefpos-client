import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/shared/api/endpoints/products'

export function useProducts(locationId: string | undefined, categoryId?: string) {
  return useQuery({
    queryKey: ['products', locationId, categoryId],
    queryFn: () => getProducts({ locationId: locationId!, categoryId }),
    enabled: Boolean(locationId),
  })
}
