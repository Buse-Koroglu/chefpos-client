import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addOrderItem, decreaseOrderItem, removeOrderItem } from '@/shared/api/endpoints/orders'
import type { OrderResponse } from '@/shared/types/order'

export function useOrderItemMutations(orderId: string) {
  const queryClient = useQueryClient()

  function syncOrder(order: OrderResponse) {
    queryClient.setQueryData(['orders', 'detail', orderId], order)
    queryClient.invalidateQueries({ queryKey: ['orders', 'history'] })
  }

  const addItem = useMutation({
    mutationFn: (payload: { productId: string; quantity: number }) => addOrderItem(orderId, payload),
    onSuccess: syncOrder,
  })

  const removeItem = useMutation({
    mutationFn: (orderItemId: string) => removeOrderItem(orderId, orderItemId),
    onSuccess: syncOrder,
  })

  const decreaseItem = useMutation({
    mutationFn: ({ orderItemId, quantity }: { orderItemId: string; quantity: number }) =>
      decreaseOrderItem(orderId, orderItemId, { quantity }),
    onSuccess: syncOrder,
  })

  return { addItem, removeItem, decreaseItem }
}
