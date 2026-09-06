import { useQuery } from '@tanstack/react-query'

import { getIngredients } from '@/shared/api/endpoints/ingredients'
import { getStockHealth } from '@/shared/lib/ingredientStockHealth'

const REFETCH_TIME = 45_000

export function useIngredientStockHealthCounts(locationId: string | undefined) {
  return useQuery({
    queryKey: ['ingredients', 'stock-health-counts', locationId],
    queryFn: async () => {
      const ingredients = await getIngredients({ locationId: locationId! })

      let warningCount = 0
      let criticalCount = 0

      for (const ingredient of ingredients) {
        const health = getStockHealth(ingredient)
        if (health === 'WARNING') warningCount += 1
        else if (health === 'CRITICAL') criticalCount += 1
      }

      return { warningCount, criticalCount }
    },
    enabled: Boolean(locationId),
    refetchInterval: REFETCH_TIME,
  })
}
