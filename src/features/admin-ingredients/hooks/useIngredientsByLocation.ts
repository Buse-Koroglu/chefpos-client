import { useQuery } from '@tanstack/react-query'
import type { LocationDto } from '@/shared/types/location'
import { getIngredients } from '@/shared/api/endpoints/ingredients'
import type { IngredientWithLocation } from '@/features/admin-ingredients/types'

async function fetchForLocation(location: LocationDto): Promise<IngredientWithLocation[]> {
  const ingredients = await getIngredients({ locationId: location.id, includeInactive: true })
  return ingredients.map((ingredient) => ({ ...ingredient, locationName: location.name }))
}

export function useIngredientsByLocation(locationFilter: string, locations: LocationDto[]) {
  return useQuery({
    queryKey: ['ingredients', 'admin', locationFilter, locations.map((location) => location.id)],
    queryFn: async () => {
      const targetLocations =
        locationFilter === 'ALL' ? locations : locations.filter((location) => location.id === locationFilter)

      const results = await Promise.all(targetLocations.map(fetchForLocation))
      return results.flat().sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    },
    enabled: locations.length > 0,
  })
}
