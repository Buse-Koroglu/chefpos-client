import type { OrderResponse } from '@/shared/types/order'

export type Order = OrderResponse

export type PaymentFilter = 'ALL' | 'UNPAID' | 'PAID'
