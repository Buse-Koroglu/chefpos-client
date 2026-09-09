import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createKioskOrder } from '@/shared/api/endpoints/orders'

export function useCreateKioskOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createKioskOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'kitchen'] })
    },
  })
}
