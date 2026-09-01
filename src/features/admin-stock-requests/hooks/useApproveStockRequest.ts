import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { approveStockRequest } from '@/shared/api/endpoints/stockRequests'

export function useApproveStockRequest(onSuccess: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, unitPrice }: { id: string; unitPrice: number }) => approveStockRequest(id, { unitPrice }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stockRequests'], exact: false })
      toast.success('Stok talebi onaylandı.')
      onSuccess()
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Stok talebi onaylanamadı.')),
  })
}
