import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/shared/api/endpoints/products'

export function useProductDetail(productId: string | undefined) {
  return useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => getProductById(productId!),
    enabled: Boolean(productId),
  })
}
