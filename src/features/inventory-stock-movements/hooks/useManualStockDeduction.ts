import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { recordManualDeduction } from '@/shared/api/endpoints/ingredients'
import type { ManualDeductionRequest } from '@/shared/types/ingredient'

interface ManualStockDeductionVariables extends ManualDeductionRequest {
  ingredientId: string
}

export function useManualStockDeduction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ingredientId, ...payload }: ManualStockDeductionVariables) =>
      recordManualDeduction(ingredientId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      await queryClient.invalidateQueries({ queryKey: ['stockMovements'] })

      toast.success('Elden düşüm başarıyla kaydedildi.')
    },
  })
}
