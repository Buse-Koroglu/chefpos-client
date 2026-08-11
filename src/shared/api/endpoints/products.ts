import { apiClient } from '@/shared/api/client'
import type { GetProductsQueryParams, ProductResponse } from '@/shared/types/product'

export function getProducts(params: GetProductsQueryParams) {
  return apiClient.get<ProductResponse[]>('/api/products', { params }).then((res) => res.data)
}
