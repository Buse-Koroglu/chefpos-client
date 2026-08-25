import { apiClient } from '@/shared/api/client'
import { ROLES } from '@/shared/types/auth'
import type {
  AddOrderItemRequest,
  CreateOrderRequest,
  DecreaseOrderItemRequest,
  GetOrdersQueryParams,
  OrderResponse,
  PagedResult,
} from '@/shared/types/order'

export function createOrder(payload: CreateOrderRequest) {
  return apiClient
    .post<OrderResponse>('/api/orders', { ...payload, requestedAs: ROLES.indexOf(payload.requestedAs) })
    .then((res) => res.data)
}

export function getOrders(params: GetOrdersQueryParams) {
  return apiClient.get<PagedResult<OrderResponse>>('/api/orders', { params }).then((res) => res.data)
}

export function completeOrder(orderId: string) {
  return apiClient.post<OrderResponse>(`/api/orders/${orderId}/complete`).then((res) => res.data)
}

export function cancelOrder(orderId: string) {
  return apiClient.post<OrderResponse>(`/api/orders/${orderId}/cancel`).then((res) => res.data)
}

export function makeOrderPaid(orderId: string) {
  return apiClient.post<OrderResponse>(`/api/orders/${orderId}/paid`).then((res) => res.data)
}

export function getOrderById(orderId: string) {
  return apiClient.get<OrderResponse>(`/api/orders/${orderId}`).then((res) => res.data)
}

export function addOrderItem(orderId: string, payload: AddOrderItemRequest) {
  return apiClient.post<OrderResponse>(`/api/orders/${orderId}/items`, payload).then((res) => res.data)
}

export function removeOrderItem(orderId: string, orderItemId: string) {
  return apiClient.delete<OrderResponse>(`/api/orders/${orderId}/items/${orderItemId}`).then((res) => res.data)
}

export function decreaseOrderItem(orderId: string, orderItemId: string, payload: DecreaseOrderItemRequest) {
  return apiClient
    .patch<OrderResponse>(`/api/orders/${orderId}/items/${orderItemId}/decrease`, payload)
    .then((res) => res.data)
}
