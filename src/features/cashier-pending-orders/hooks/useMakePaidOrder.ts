import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeOrderPaid } from '@/shared/api/endpoints/orders'

export function useMakePaidOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: makeOrderPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
