import type { StockUnit } from './ingredient'

export const STOCK_MOVEMENT_TYPES = ['PURCHASE', 'ORDER_SALE', 'MANUAL_DEDUCTION', 'PRODUCTION_DEDUCTION'] as const

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number]

export const STOCK_MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  PURCHASE: 'Alış',
  ORDER_SALE: 'Sipariş Satışı',
  MANUAL_DEDUCTION: 'Elden Düşüm',
  PRODUCTION_DEDUCTION: 'Üretim Düşümü',
}

export interface StockMovementResponseDto {
  id: string
  ingredientId: string
  ingredientName: string
  unit: StockUnit
  locationId: string
  type: StockMovementType
  quantity: number
  performedByUserId: string
  performedByUserName: string
  relatedOrderId: string | null
  relatedProductId: string | null
  note: string | null
  weightedUnitPrice: number
  createdAt: string
}

export interface GetStockMovementsPagedQueryRequest {
  ingredientId?: string
  locationId?: string
  type?: StockMovementType
  pageNumber?: number
  pageSize?: number
}

