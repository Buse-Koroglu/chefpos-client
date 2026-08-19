import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/shared/api/endpoints/categories'

export function useCategories(locationId: string | undefined) {
  return useQuery({
    queryKey: ['categories', locationId],
    queryFn: () => getCategories({ locationId: locationId! }),
    enabled: Boolean(locationId),
  })
}
