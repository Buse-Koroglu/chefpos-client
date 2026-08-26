import type { ProductResponse } from '@/shared/types/product'

export type Product = ProductResponse

export interface KioskCartItem {
  productId: string
  name: string
  price: number
  quantity: number
}
