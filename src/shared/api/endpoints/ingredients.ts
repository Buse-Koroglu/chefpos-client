import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import type {
  CreateIngredientRequest,
  GetIngredientsQueryParams,
  IngredientResponseDto,
  UpdateIngredientRequest,
} from '@/shared/types/ingredient'

interface RawIngredientPayload {
  id: string
  name: string
  unit: number
  unitPrice: number
  currentStock: number
  minStockThreshold: number
  isBelowThreshold: boolean
  isActive: boolean
  locationId: string
}

function normalizeIngredient(raw: RawIngredientPayload): IngredientResponseDto {
  return { ...raw, unit: STOCK_UNITS[raw.unit] }
}

export function getIngredients(params: GetIngredientsQueryParams) {
  return apiClient
    .get<RawIngredientPayload[]>('/api/ingredients', { params })
    .then((res) => res.data.map(normalizeIngredient))
}

export function createIngredient(payload: CreateIngredientRequest) {
  return apiClient
    .post<RawIngredientPayload[]>('/api/ingredients', { ...payload, unit: STOCK_UNITS.indexOf(payload.unit) })
    .then((res) => res.data.map(normalizeIngredient))
}

export function updateIngredient(id: string, payload: UpdateIngredientRequest) {
  return apiClient.patch<RawIngredientPayload>(`/api/ingredients/${id}`, payload).then((res) => normalizeIngredient(res.data))
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
