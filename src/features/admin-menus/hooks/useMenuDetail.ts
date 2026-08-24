import { useQuery } from '@tanstack/react-query'
import { getMenuById } from '@/shared/api/endpoints/menus'

export function useMenuDetail(menuId: string | undefined) {
  return useQuery({
    queryKey: ['menus', 'detail', menuId],
    queryFn: () => getMenuById(menuId!),
    enabled: Boolean(menuId),
  })
}
