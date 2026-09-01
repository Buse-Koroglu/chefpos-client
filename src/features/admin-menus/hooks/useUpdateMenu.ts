import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { activateMenu, deactivateMenu, updateMenu } from '@/shared/api/endpoints/menus'

interface UpdateMenuVariables {
  menuId: string
  details: { name: string; description: string | null } | null
  isActive: boolean | null
}

export function useUpdateMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ menuId, details, isActive }: UpdateMenuVariables) => {
      if (details) {
        await updateMenu(menuId, details)
      }
      if (isActive !== null) {
        await (isActive ? activateMenu(menuId) : deactivateMenu(menuId))
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'detail', variables.menuId] })
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      toast.success('Menü bilgileri güncellendi.')
    },
  })
}
