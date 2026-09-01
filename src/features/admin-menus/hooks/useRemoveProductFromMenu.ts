import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeProductFromMenu } from '@/shared/api/endpoints/menus'

interface RemoveProductFromMenuVariables {
  menuId: string
  productId: string
}

export function useRemoveProductFromMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ menuId, productId }: RemoveProductFromMenuVariables) =>
      removeProductFromMenu(menuId, productId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'detail', variables.menuId] })
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      toast.success('Ürün menüden çıkarıldı.')
    },
    onError: () => {
      toast.error('Ürün menüden çıkarılamadı.')
    },
  })
}
