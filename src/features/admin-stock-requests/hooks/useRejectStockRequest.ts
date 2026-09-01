import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { rejectStockRequest } from '@/shared/api/endpoints/stockRequests'

export function useRejectStockRequest(onSuccess: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectStockRequest(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockRequests'], exact: false })
      toast.success('Stok talebi reddedildi.')
      onSuccess()
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Stok talebi reddedilemedi.')),
  })
}
