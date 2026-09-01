import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  activateIngredient,
  deactivateIngredient,
  updateIngredient,
  updateIngredientMinStockThreshold,
  updateIngredientPrice,
} from '@/shared/api/endpoints/ingredients'

export interface UpdateIngredientVariables {
  ingredientId: string
  name?: string
  unitPrice?: number
  minStockThreshold?: number
  isActive?: boolean
}

async function updateIngredientDetails(variables: UpdateIngredientVariables) {
  const { ingredientId, name, unitPrice, minStockThreshold, isActive } = variables

  if (name !== undefined) {
    await updateIngredient(ingredientId, { name })
  }
  if (unitPrice !== undefined) {
    await updateIngredientPrice(ingredientId, { unitPrice })
  }
  if (minStockThreshold !== undefined) {
    await updateIngredientMinStockThreshold(ingredientId, minStockThreshold)
  }
  if (isActive !== undefined) {
    await (isActive ? activateIngredient(ingredientId) : deactivateIngredient(ingredientId))
  }
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateIngredientDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'], exact: false })
      toast.success('Ham madde bilgileri güncellendi.')
    },
  })
}
