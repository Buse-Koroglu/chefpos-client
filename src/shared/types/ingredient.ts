export const STOCK_UNITS = ['KG', 'LT'] as const

export type StockUnit = (typeof STOCK_UNITS)[number]

export const STOCK_UNIT_LABELS: Record<StockUnit, string> = {
  KG: 'KG',
  LT: 'L',
}

export interface IngredientResponseDto {
  id: string
  name: string
  unit: StockUnit
  unitPrice: number
  currentStock: number
  minStockThreshold: number
  isBelowThreshold: boolean
  isActive: boolean
  locationId: string
}

export interface GetIngredientsQueryParams {
  locationId: string
  includeInactive?: boolean
}

export interface CreateIngredientRequest {
  name: string
  unit: StockUnit
  unitPrice: number
  locationIds: string[]
  initialStock: number
  minStockThreshold: number
}

export interface UpdateIngredientRequest {
  name: string
  unitPrice: number
}
