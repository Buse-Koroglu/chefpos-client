import type { ProductResponse } from '@/shared/types/product'

export type Product = ProductResponse

export interface OrderItem extends Product {
  quantity: number
}
