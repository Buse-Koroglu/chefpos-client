import type { Role } from "./auth";

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type OrderType = "CASHIER" | "WAITER" | "SELF_SERVICE";

export interface OrderItemResponse {
  id: string;
  quantity: number;
  name: string;
  price: number;
  productId: string | null;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  locationId: string;
  tableId?: string | null;
  isPackage?: boolean;
  customerName?: string | null;
  items: CreateOrderItem[];
  requestedAs: Role;
}

export interface CreateKioskOrderRequest {
  locationId: string;
  customerName: string;
  items: CreateOrderItem[];
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
  createdAt: string;
  completedAt: string | null;
  createdByUserId: string | null;
  tableId: string | null;
  tableNumber: number | null;
  isPackage: boolean;
}

export interface GetOrdersQueryRequest {
  locationId: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  type?: OrderType;
  searchTerm?: string;
  waiterId?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface AddOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface DecreaseOrderItemRequest {
  quantity: number;
}