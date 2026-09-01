import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addProductIngredient } from '@/shared/api/endpoints/products'
import type { AddProductIngredientRequest } from '@/shared/types/product'

interface AddProductIngredientVariables {
  productId: string
  payload: AddProductIngredientRequest
}

export function useAddProductIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, payload }: AddProductIngredientVariables) => addProductIngredient(productId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'admin'], exact: false })
      toast.success('Ham madde reçeteye eklendi.')
    },
    onError: () => {
      toast.error('Ham madde reçeteye eklenemedi.')
    },
  })
}
