import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/shared/api/endpoints/ingredients'

export function useLocationIngredients(locationId: string) {
  return useQuery({
    queryKey: ['ingredients', 'for-product-recipe', locationId],
    queryFn: () => getIngredients({ locationId, includeInactive: false }),
  })
}
