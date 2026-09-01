import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createStockRequest } from '@/shared/api/endpoints/stockRequests'
import type { CreateStockRequestRequest } from '@/shared/types/stockRequest'

export function useCreateStockRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStockRequestRequest) => createStockRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stock-requests'] })
      await queryClient.invalidateQueries({ queryKey: ['inventory-dashboard'] })

      toast.success('Stok talebi başarıyla oluşturuldu.')
    },
  })
}
