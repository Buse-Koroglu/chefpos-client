import { apiClient } from '@/shared/api/client'
import type {
  CategoryAdminResponseDto,
  CategoryResponseDto,
  CreateCategoryRequest,
  GetCategoriesAdminQueryParams,
  GetCategoriesQueryParams,
  PagedResult,
  UpdateCategoryRequest,
} from '@/shared/types/category'

export function getCategories(params: GetCategoriesQueryParams) {
  return apiClient.get<CategoryResponseDto[]>('/api/category', { params }).then((res) => res.data)
}

export function getCategoriesAdmin(params: GetCategoriesAdminQueryParams) {
  return apiClient
    .get<PagedResult<CategoryAdminResponseDto>>('/api/category/categories', { params })
    .then((res) => res.data)
}

export function createCategory(payload: CreateCategoryRequest) {
  return apiClient.post<CategoryResponseDto>('/api/category', payload).then((res) => res.data)
}

export function updateCategory(id: string, payload: UpdateCategoryRequest) {
  return apiClient.patch<CategoryResponseDto>(`/api/category/${id}`, payload).then((res) => res.data)
}

/**
 * `locationId` is only used by the backend to verify the category belongs to that location — any
 * location from the category's `locationIds` works. Activation/deactivation is a global flag: it
 * flips the category's status across every location it's assigned to, not just the one passed here.
 */
export function activateCategory(id: string, locationId: string) {
  return apiClient.post<CategoryResponseDto>('/api/category/activate', { id, locationId }).then((res) => res.data)
}

export function deactivateCategory(id: string, locationId: string) {
  return apiClient.post<CategoryResponseDto>('/api/category/deactivate', { id, locationId }).then((res) => res.data)
}

export function addCategoryLocation(categoryId: string, locationId: string) {
  return apiClient
    .post<CategoryResponseDto>(`/api/category/${categoryId}/locations`, { locationId })
    .then((res) => res.data)
}

export function removeCategoryLocation(categoryId: string, locationId: string) {
  return apiClient
    .delete<CategoryResponseDto>(`/api/category/${categoryId}/locations/${locationId}`)
    .then((res) => res.data)
}
