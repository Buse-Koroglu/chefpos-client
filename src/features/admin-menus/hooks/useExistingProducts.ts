import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/shared/api/endpoints/products'

export function useExistingProducts(locationId: string | undefined) {
  return useQuery({
    queryKey: ['products', 'for-menu-picker', locationId],
    queryFn: () => getProducts({ locationId: locationId!, includeInactive: false, includeUncategorized: true }),
    enabled: Boolean(locationId),
  })
}
