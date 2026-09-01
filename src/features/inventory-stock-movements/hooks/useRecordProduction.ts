import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { recordProductProduction } from '@/shared/api/endpoints/ingredients'
import type { ProductProductionRequest } from '@/shared/types/ingredient'

export function useRecordProduction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductProductionRequest) => recordProductProduction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      await queryClient.invalidateQueries({ queryKey: ['stockMovements'] })

      toast.success('Üretim başarıyla kaydedildi.')
    },
  })
}
