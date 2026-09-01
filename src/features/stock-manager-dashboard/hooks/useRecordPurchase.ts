import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { recordIngredientPurchase } from '@/shared/api/endpoints/ingredients'
import type { IngredientPurchaseRequest } from '@/shared/types/ingredient'

interface RecordPurchaseVariables extends IngredientPurchaseRequest {
  ingredientId: string
}

export function useRecordPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ingredientId, ...payload }: RecordPurchaseVariables) =>
      recordIngredientPurchase(ingredientId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      await queryClient.invalidateQueries({ queryKey: ['stockMovements'] })

      toast.success('Parti alışı başarıyla kaydedildi.')
    },
  })
}
