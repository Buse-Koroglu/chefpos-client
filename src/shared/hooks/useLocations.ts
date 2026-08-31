import { useQuery } from '@tanstack/react-query'
import { getLocations } from '@/shared/api/endpoints/locations'

export function useLocations() { // tüm lokasyonları çekmek için kullanılır
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations(),
  })
}
