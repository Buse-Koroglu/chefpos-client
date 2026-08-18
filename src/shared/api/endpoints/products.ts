import { apiClient } from '@/shared/api/client'
import { STOCK_UNITS } from '@/shared/types/ingredient'
import type {
  AddProductIngredientRequest,
  CreateProductRequest,
  GetProductsPagedQueryParams,
  GetProductsQueryParams,
  PagedResult,
  ProductAdminResponseDto,
  ProductResponse,
  UpdateProductRequest,
} from '@/shared/types/product'

interface RawProductItemPayload {
  id: string
  ingredientId: string
  ingredientName: string
  unit: number
  quantityPerServing: number
}

interface RawProductLocationPayload {
  locationId: string
  ingredients: RawProductItemPayload[]
}

interface RawProductPayload {
  id: string
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  isActive: boolean
  categoryId: string
  locationIds: string[]
  locations: RawProductLocationPayload[]
}

function normalizeProduct(raw: RawProductPayload): ProductResponse {
  return {
    ...raw,
    locations: raw.locations.map((location) => ({
      locationId: location.locationId,
      ingredients: location.ingredients.map((item) => ({ ...item, unit: STOCK_UNITS[item.unit] })),
    })),
  }
}

export function getProducts(params: GetProductsQueryParams) {
  return apiClient
    .get<RawProductPayload[]>('/api/products', { params })
    .then((res) => res.data.map(normalizeProduct))
}

export function getProductById(id: string) {
  return apiClient.get<RawProductPayload>(`/api/products/${id}`).then((res) => normalizeProduct(res.data))
}

export function getProductsPaged(params: GetProductsPagedQueryParams) {
  return apiClient
    .get<PagedResult<ProductAdminResponseDto>>('/api/products/paged', { params })
    .then((res) => res.data)
}

export function createProduct(payload: CreateProductRequest) {
  return apiClient.post<RawProductPayload>('/api/products', payload).then((res) => normalizeProduct(res.data))
}

export function updateProduct(id: string, payload: UpdateProductRequest) {
  return apiClient.patch<RawProductPayload>(`/api/products/${id}`, payload).then((res) => normalizeProduct(res.data))
}

export function updateProductPrice(id: string, newPrice: number) {
  return apiClient
    .patch<RawProductPayload>(`/api/products/${id}/price`, { newPrice })
    .then((res) => normalizeProduct(res.data))
}

export function activateProduct(id: string, locationId: string) {
  return apiClient.post<RawProductPayload>('/api/products/activate', { id, locationId }).then((res) => normalizeProduct(res.data))
}

export function deactivateProduct(id: string, locationId: string) {
  return apiClient
    .post<RawProductPayload>('/api/products/deactivate', { id, locationId })
    .then((res) => normalizeProduct(res.data))
}

export function addProductIngredient(productId: string, payload: AddProductIngredientRequest) {
  return apiClient
    .post<RawProductPayload>(`/api/products/${productId}/ingredients`, payload)
    .then((res) => normalizeProduct(res.data))
}

export function removeProductIngredient(productId: string, productItemId: string, locationId: string) {
  return apiClient
    .delete<RawProductPayload>(`/api/products/${productId}/ingredients/${productItemId}`, { params: { locationId } })
    .then((res) => normalizeProduct(res.data))
}

export function addProductLocation(productId: string, locationId: string) {
  return apiClient
    .post<RawProductPayload>(`/api/products/${productId}/locations`, { locationId })
    .then((res) => normalizeProduct(res.data))
}

export function removeProductLocation(productId: string, locationId: string) {
  return apiClient
    .delete<RawProductPayload>(`/api/products/${productId}/locations/${locationId}`)
    .then((res) => normalizeProduct(res.data))
}
