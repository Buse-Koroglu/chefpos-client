import { useQuery } from '@tanstack/react-query'
import { getKioskProducts } from '@/shared/api/endpoints/products'

export function useKioskProducts(locationId: string | undefined, categoryId?: string) {
  return useQuery({
    queryKey: ['kiosk', 'products', locationId, categoryId],
    queryFn: () => getKioskProducts({ locationId: locationId!, categoryId: categoryId || undefined }),
    enabled: Boolean(locationId),
  })
}
