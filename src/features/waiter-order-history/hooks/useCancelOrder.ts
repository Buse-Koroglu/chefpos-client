import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelOrder } from '@/shared/api/endpoints/orders'

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'detail'] })
    },
  })
}
