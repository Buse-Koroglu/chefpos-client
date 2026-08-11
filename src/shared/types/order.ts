import type { Role } from "./auth";

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
  status: string;
  type: string;
  paymentStatus: string;
  items: OrderItemResponse[];
  completedAt: string | null;
}

export interface AddOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface DecreaseOrderItemRequest {
  quantity: number;
}