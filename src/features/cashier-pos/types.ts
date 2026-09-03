import type { ProductAdminResponseDto } from '@/shared/types/product'

export type Product = ProductAdminResponseDto

export interface OrderItem extends Product {
  quantity: number
}
