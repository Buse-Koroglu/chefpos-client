import type { ProductResponse } from '@/shared/types/product'

export type Product = ProductResponse

export interface KioskCardItem {
  productId: string
  name: string
  price: number
  quantity: number
}
