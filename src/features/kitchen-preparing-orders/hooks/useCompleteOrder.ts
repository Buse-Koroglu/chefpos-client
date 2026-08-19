import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { completeOrder } from '@/shared/api/endpoints/orders'

export function useCompleteOrder() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) =>
      completeOrder(orderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders', 'preparing'],
      })
    },
  })
}