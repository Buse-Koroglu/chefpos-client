import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeOrder } from '@/shared/api/endpoints/orders'

export function useCompleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending-count'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
