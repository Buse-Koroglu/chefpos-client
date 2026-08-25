import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '@/shared/api/endpoints/orders'

export function useOrderDetail(orderId: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
  })
}
