import type { StockUnit } from './ingredient'

export const STOCK_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const

export type StockRequestStatus = (typeof STOCK_REQUEST_STATUSES)[number]

export const STOCK_REQUEST_STATUS_LABELS: Record<StockRequestStatus, string> = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
}

export interface AdminStockRequestResponseDto {
  id: string
  ingredientId: string
  ingredientName: string
  unit: StockUnit
  locationId: string
  locationName: string
  requestedQuantity: number
  status: StockRequestStatus
  createdAt: string
  requestedByUserId: string
  requestedByUserName: string
  decidedByUserId?: string | null
  decidedByUserName?: string | null
  rejectionReason?: string | null
  decidedAt?: string | null
  approvedUnitPrice?: number | null
  ingredientLatestUnitPrice: number | null
  ingredientWeightedAverageUnitPrice: number
}

export interface GetStockRequestsPagedQueryParams {
  searchTerm?: string
  locationId?: string
  status?: StockRequestStatus
  onlyMyRequests?: boolean
  onlyHistory?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface RejectStockRequestRequest {
  reason: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}