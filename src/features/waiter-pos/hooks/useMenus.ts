import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/shared/api/endpoints/menus'

export function useMenus(locationId: string | undefined) {
  return useQuery({
    queryKey: ['menus', 'for-sale', locationId],
    queryFn: () => getMenus({ locationId: locationId!, includeInactive: false }),
    enabled: Boolean(locationId),
  })
}
