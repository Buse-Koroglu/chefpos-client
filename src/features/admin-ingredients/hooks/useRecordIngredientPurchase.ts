import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { recordIngredientPurchase } from '@/shared/api/endpoints/ingredients'

export interface RecordIngredientPurchaseVariables {
  ingredientId: string
  quantity: number
  unitPrice: number
  note?: string
}

export function useRecordIngredientPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ingredientId, quantity, unitPrice, note }: RecordIngredientPurchaseVariables) =>
      recordIngredientPurchase(ingredientId, { quantity, unitPrice, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] })
      toast.success('Fiyat güncellendi ve parti alışı kaydedildi.')
    },
  })
}
