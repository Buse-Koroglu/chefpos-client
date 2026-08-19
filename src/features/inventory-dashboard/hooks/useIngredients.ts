import { useQuery } from '@tanstack/react-query'

import { getIngredients } from '@/shared/api/endpoints/ingredients'

export function useIngredients(locationId: string | undefined) {
  return useQuery({
    queryKey: ['ingredients', locationId],
    queryFn: () =>
      getIngredients({
        locationId: locationId!,
      }),
    enabled: Boolean(locationId),
  })
}