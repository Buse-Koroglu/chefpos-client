import type { Role } from "./auth";

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type OrderType = "CASHIER" | "WAITER" | "SELF_SERVICE";

export interface OrderItemResponse {
  id: string;
  quantity: number;
  name: string;
  price: number;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  locationId: string;
  customerName?: string | null;
  items: CreateOrderItem[];
  requestedAs: Role;
}

export interface OrderResponse {
  id: string;
  orderNumber: number;
  customerName: string;
  totalPrice: number;
  status: OrderStatus;
  type: OrderType;
  paymentStatus: PaymentStatus;
  items: OrderItemResponse[];
  completedAt: string | null;
}

export interface GetOrdersQueryParams {
  locationId: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  type?: OrderType;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AddOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface DecreaseOrderItemRequest {
  quantity: number;
}