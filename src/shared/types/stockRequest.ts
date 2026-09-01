import type { StockUnit } from './ingredient'

export const STOCK_REQUEST_STATUS = ['PENDING', 'APPROVED', 'REJECTED'] as const

export type StockRequestStatus = (typeof STOCK_REQUEST_STATUS)[number] // stock status değerlerini backend ile aynı şekilde number halinde 

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

export interface GetStockRequestsPagedQueryRequest {
  searchTerm?: string
  locationId?: string
  status?: StockRequestStatus
  onlyMyRequests?: boolean
  onlyHistory?: boolean
  startDate?: string
  endDate?: string
  pageNumber?: number
  pageSize?: number
}

export interface RejectStockRequestRequest {
  reason: string
}

export type ExportStockRequestsQueryRequest = Omit<
  GetStockRequestsPagedQueryRequest,
  'pageNumber' | 'pageSize' | 'onlyMyRequests'
>

export interface StockRequestResponse {
  id: string
  ingredientId: string
  ingredientName: string
  locationId: string
  requestedByUserId: string
  requestedQuantity: number
  status: StockRequestStatus
  decidedByUserId: string | null
  rejectionReason: string | null
  decidedAt: string | null
}

export interface ApproveStockRequestRequest {
  unitPrice: number
}

export interface CreateStockRequestRequest {
  ingredientId: string
  requestedQuantity: number
}