import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addProductToMenu } from '@/shared/api/endpoints/menus'

interface AddProductToMenuVariables {
  menuId: string
  productId: string
}

export function useAddProductToMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ menuId, productId }: AddProductToMenuVariables) =>
      addProductToMenu(menuId, { productId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'detail', variables.menuId] })
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      toast.success('Ürün menüye eklendi.')
    },
    onError: () => {
      toast.error('Ürün menüye eklenemedi.')
    },
  })
}
