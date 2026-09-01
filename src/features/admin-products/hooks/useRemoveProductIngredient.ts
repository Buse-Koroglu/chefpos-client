import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeProductIngredient } from '@/shared/api/endpoints/products'

interface RemoveProductIngredientVariables {
  productId: string
  productItemId: string
  locationId: string
}

export function useRemoveProductIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, productItemId, locationId }: RemoveProductIngredientVariables) =>
      removeProductIngredient(productId, productItemId, locationId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'admin'], exact: false })
      toast.success('Ham madde reçeteden kaldırıldı.')
    },
    onError: () => {
      toast.error('Ham madde reçeteden kaldırılamadı.')
    },
  })
}
