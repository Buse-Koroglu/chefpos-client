import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import { STOCK_REQUEST_STATUS} from '@/shared/types/stockRequest'
import type { PagedResult } from '@/shared/types/pagination'
import type {
  AdminStockRequestResponseDto,
  ApproveStockRequestRequest,
  CreateStockRequestRequest,
  ExportStockRequestsQueryRequest,
  GetStockRequestsPagedQueryRequest,
  RejectStockRequestRequest,
  StockRequestResponse,
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

function normalizeStockRequest(raw: RawStockRequestPayload): AdminStockRequestResponseDto {
  return { ...raw, unit: STOCK_UNITS[raw.unit], status: STOCK_REQUEST_STATUS[raw.status] }
}

export function getStockRequestsPaged(params: GetStockRequestsPagedQueryRequest) {
  return apiClient.get<PagedResult<RawStockRequestPayload>>('/api/stock-requests/paged', { params })
    .then((res) => ({ ...res.data, items: res.data.items.map(normalizeStockRequest) }))
}

export function exportStockRequests(params: ExportStockRequestsQueryRequest): Promise<Blob> {
  return apiClient.get<Blob>('/api/stock-requests/export', { params, responseType: 'blob' })
    .then((res) => res.data)
}

export function approveStockRequest(id: string, payload: ApproveStockRequestRequest) {
  return apiClient.post<RawStockRequestPayload>(`/api/stock-requests/${id}/approve`, payload)
    .then((res) => normalizeStockRequest(res.data))
}

export function rejectStockRequest(id: string, payload: RejectStockRequestRequest) {
  return apiClient.post<RawStockRequestPayload>(`/api/stock-requests/${id}/reject`, payload)
    .then((res) => normalizeStockRequest(res.data))
}

export async function createStockRequest(request: CreateStockRequestRequest) {
  const response = await apiClient.post<StockRequestResponse>('/api/stock-requests',request)
  return response.data
}