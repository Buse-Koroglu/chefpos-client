import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import { STOCK_MOVEMENT_TYPES } from '@/shared/types/stockMovement'
import type {
  GetStockMovementsPagedQueryParams,
  PagedResult,
  StockMovementResponseDto,
} from '@/shared/types/stockMovement'

interface RawStockMovementPayload {
  id: string
  ingredientId: string
  ingredientName: string
  unit: number
  locationId: string
  type: number
  quantity: number
  performedByUserId: string
  performedByUserName: string
  relatedOrderId: string | null
  relatedProductId: string | null
  note: string | null
  weightedUnitPrice: number
  createdAt: string
}

function normalizeStockMovement(raw: RawStockMovementPayload): StockMovementResponseDto {
  return { ...raw, unit: STOCK_UNITS[raw.unit], type: STOCK_MOVEMENT_TYPES[raw.type] }
}

export function getStockMovementsPaged(params: GetStockMovementsPagedQueryParams) {
  return apiClient
    .get<PagedResult<RawStockMovementPayload>>('/api/stock-movements/paged', { params })
    .then((res) => ({ ...res.data, items: res.data.items.map(normalizeStockMovement) }))
}
