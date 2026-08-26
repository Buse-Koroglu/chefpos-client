import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import { STOCK_REQUEST_STATUSES } from '@/shared/types/stockRequest'
import type {
  AdminStockRequestResponseDto,
  GetStockRequestsPagedQueryParams,
  PagedResult,
  RejectStockRequestRequest,
  StockRequestStatus,
} from '@/shared/types/stockRequest'

interface RawStockRequestPayload {
  id: string
  ingredientId: string
  ingredientName: string
  unit: number
  locationId: string
  locationName: string
  requestedQuantity: number
  status: number
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

function normalizeStockRequest(raw: RawStockRequestPayload): AdminStockRequestResponseDto {
  return { ...raw, unit: STOCK_UNITS[raw.unit], status: STOCK_REQUEST_STATUSES[raw.status] }
}

export function getStockRequestsPaged(params: GetStockRequestsPagedQueryParams) {
  return apiClient
    .get<PagedResult<RawStockRequestPayload>>('/api/stock-requests/paged', { params })
    .then((res) => ({ ...res.data, items: res.data.items.map(normalizeStockRequest) }))
}

export type ExportStockRequestsQueryParams = Omit<GetStockRequestsPagedQueryParams, 'pageNumber' | 'pageSize' | 'onlyMyRequests'>

export function exportStockRequests(params: ExportStockRequestsQueryParams): Promise<Blob> {
  return apiClient
    .get<Blob>('/api/stock-requests/export', { params, responseType: 'blob' })
    .then((res) => res.data)
}

export interface ApproveStockRequestRequest {
  unitPrice: number
}

export function approveStockRequest(id: string, payload: ApproveStockRequestRequest) {
  return apiClient
    .post<RawStockRequestPayload>(`/api/stock-requests/${id}/approve`, payload)
    .then((res) => normalizeStockRequest(res.data))
}

export function rejectStockRequest(id: string, payload: RejectStockRequestRequest) {
  return apiClient
    .post<RawStockRequestPayload>(`/api/stock-requests/${id}/reject`, payload)
    .then((res) => normalizeStockRequest(res.data))
}

export interface CreateStockRequestRequest {
  ingredientId: string
  requestedQuantity: number
}

export async function createStockRequest(
  request: CreateStockRequestRequest,
) {
  const response = await apiClient.post<StockRequestResponse>(
    '/api/stock-requests',
    request,
  )

  return response.data
}