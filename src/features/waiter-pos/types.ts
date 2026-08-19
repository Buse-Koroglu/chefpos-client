import type { ProductAdminResponseDto } from '@/shared/types/product'
import type { TableResponseDto } from '@/shared/types/table'

export type Product = ProductAdminResponseDto
export type Table = TableResponseDto

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  note?: string
}