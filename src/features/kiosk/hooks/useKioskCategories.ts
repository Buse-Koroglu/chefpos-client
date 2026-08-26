import { useQuery } from '@tanstack/react-query'
import { getKioskCategories } from '@/shared/api/endpoints/categories'

export function useKioskCategories(locationId: string | undefined) {
  return useQuery({
    queryKey: ['kiosk', 'categories', locationId],
    queryFn: () => getKioskCategories({ locationId: locationId! }),
    enabled: Boolean(locationId),
  })
}
