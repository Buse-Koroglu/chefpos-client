import { apiClient } from '@/shared/api/client'
import { ROLES } from '@/shared/types/auth'
import type { CreateOrderRequest, OrderResponse } from '@/shared/types/order'

export function createOrder(payload: CreateOrderRequest) {
  return apiClient
    .post<OrderResponse>('/api/orders', { ...payload, requestedAs: ROLES.indexOf(payload.requestedAs) })
    .then((res) => res.data)
}
