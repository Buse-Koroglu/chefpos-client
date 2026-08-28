import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import type {
  CreateIngredientRequest,
  GetIngredientsPagedQueryParams,
  GetIngredientsQueryParams,
  IngredientAdminResponseDto,
  IngredientResponseDto,
  PagedResult,
  IngredientPurchaseRequest,
  ManualDeductionRequest,
  ProductProductionRequest,
  UpdateIngredientPriceRequest,
  UpdateIngredientRequest,
} from '@/shared/types/ingredient'

interface RawIngredientPayload {
  id: string
  name: string
  unit: number
  latestUnitPrice: number | null
  weightedAverageUnitPrice: number
  currentStock: number
  minStockThreshold: number
  isBelowThreshold: boolean
  isActive: boolean
  locationId: string
}

interface RawIngredientAdminPayload extends RawIngredientPayload {
  locationName: string
}

function normalizeIngredient(raw: RawIngredientPayload): IngredientResponseDto {
  return { ...raw, unit: STOCK_UNITS[raw.unit] }
}

export function getIngredients(params: GetIngredientsQueryParams) {
  return apiClient
    .get<RawIngredientPayload[]>('/api/ingredients', { params })
    .then((res) => res.data.map(normalizeIngredient))
}

export function getIngredientsPaged(params: GetIngredientsPagedQueryParams) {
  return apiClient
    .get<PagedResult<RawIngredientAdminPayload>>('/api/ingredients/paged', { params })
    .then((res) => ({
      ...res.data,
      items: res.data.items.map((raw): IngredientAdminResponseDto => ({ ...normalizeIngredient(raw), locationName: raw.locationName })),
    }))
}

export type ExportIngredientsQueryParams = Omit<GetIngredientsPagedQueryParams, 'pageNumber' | 'pageSize'>

export function exportIngredients(params: ExportIngredientsQueryParams): Promise<Blob> {
  return apiClient
    .get<Blob>('/api/ingredients/export', { params, responseType: 'blob' })
    .then((res) => res.data)
}

export function createIngredient(payload: CreateIngredientRequest) {
  return apiClient
    .post<RawIngredientPayload[]>('/api/ingredients', { ...payload, unit: STOCK_UNITS.indexOf(payload.unit) })
    .then((res) => res.data.map(normalizeIngredient))
}

export function updateIngredient(id: string, payload: UpdateIngredientRequest) {
  return apiClient.patch<RawIngredientPayload>(`/api/ingredients/${id}`, payload).then((res) => normalizeIngredient(res.data))
}

export function updateIngredientPrice(id: string, payload: UpdateIngredientPriceRequest) {
  return apiClient.patch<RawIngredientPayload>(`/api/ingredients/${id}/price`, payload).then((res) => normalizeIngredient(res.data))
}

export function updateIngredientMinStockThreshold(id: string, minStockThreshold: number) {
  return apiClient
    .patch<RawIngredientPayload>(`/api/ingredients/${id}/min-stock-threshold`, { minStockThreshold })
    .then((res) => normalizeIngredient(res.data))
}

export function activateIngredient(id: string) {
  return apiClient.post<RawIngredientPayload>(`/api/ingredients/${id}/activate`).then((res) => normalizeIngredient(res.data))
}

export function deactivateIngredient(id: string) {
  return apiClient
    .post<RawIngredientPayload>(`/api/ingredients/${id}/deactivate`)
    .then((res) => normalizeIngredient(res.data))
}

export function recordIngredientPurchase(id: string, payload: IngredientPurchaseRequest) {
  return apiClient
    .post<RawIngredientPayload>(`/api/ingredients/${id}/purchases`, payload)
    .then((res) => normalizeIngredient(res.data))
}

export function recordManualDeduction(id: string, payload: ManualDeductionRequest) {
  return apiClient
    .post<RawIngredientPayload>(`/api/ingredients/${id}/manual-deduction`, payload)
    .then((res) => normalizeIngredient(res.data))
}

export function recordProductProduction(payload: ProductProductionRequest) {
  return apiClient
    .post<RawIngredientPayload[]>('/api/ingredients/production', payload)
    .then((res) => res.data.map(normalizeIngredient))
}
