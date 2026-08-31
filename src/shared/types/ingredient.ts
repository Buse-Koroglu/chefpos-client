export const STOCK_UNITS = ['KG', 'LT'] as const
 
export type StockUnit = (typeof STOCK_UNITS)[number]
 
export const STOCK_UNIT_LABELS: Record<StockUnit, string> = { KG: 'KG', LT: 'L',}
 
export interface IngredientResponseDto {
  id: string
  name: string
  unit: StockUnit
  latestUnitPrice: number | null
  weightedAverageUnitPrice: number
  currentStock: number
  minStockThreshold: number
  isBelowThreshold: boolean
  isActive: boolean
  locationId: string
}
 
export interface GetIngredientsQueryRequest {
  locationId: string
  includeInactive?: boolean
}
 
export interface IngredientAdminResponseDto extends IngredientResponseDto {
  locationName: string
}
 
export interface GetIngredientsPagedQueryRequest {
  searchTerm?: string
  locationId?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
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
}

export interface UpdateIngredientPriceRequest {
  unitPrice: number
}
 
export interface IngredientPurchaseRequest {
  quantity: number
  unitPrice: number
  note?: string
}
 
export interface ManualDeductionRequest {
  quantity: number
  note: string
}
 
export interface ProductProductionRequest {
  productId: string
  locationId: string
  quantity: number
  note?: string
}

export type ExportIngredientsQueryRequest = Omit<GetIngredientsPagedQueryRequest, 'pageNumber' | 'pageSize'>
