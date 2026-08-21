import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/shared/api/endpoints/products'

export function useProducts(locationId: string | undefined) {
  return useQuery({
    queryKey: ['products', locationId],
    queryFn: () => getProducts({ locationId: locationId! }),
    enabled: Boolean(locationId),
  })
}
