import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/shared/api/endpoints/menus'

export function useMenus(locationId: string | undefined, includeInactive: boolean) {
  return useQuery({
    queryKey: ['menus', locationId, includeInactive],
    queryFn: () => getMenus({ locationId: locationId!, includeInactive }),
    enabled: Boolean(locationId),
  })
}
