import { apiClient } from '@/shared/api/client'
import { kioskClient } from '@/shared/api/kioskClient'
import type { PagedResult } from '@/shared/types/pagination'
import type { CategoryAdminResponseDto, CategoryResponseDto, CreateCategoryRequest, ExportCategoriesQueryRequest, GetCategoriesAdminQueryRequest, GetCategoriesQueryRequest, UpdateCategoryRequest } from '@/shared/types/category'

export function getCategories(params: GetCategoriesQueryRequest) {
  return apiClient.get<CategoryResponseDto[]>('/api/category', { params }).then((res) => res.data)
}

export function getKioskCategories(params: GetCategoriesQueryRequest) {
  return kioskClient.get<CategoryResponseDto[]>('/api/category', { params }).then((res) => res.data)
}

export function getCategoriesAdmin(params: GetCategoriesAdminQueryRequest) {
  return apiClient.get<PagedResult<CategoryAdminResponseDto>>('/api/category/categories', { params })
    .then((res) => res.data)
}

export function exportCategories(params: ExportCategoriesQueryRequest): Promise<Blob> {
  return apiClient.get<Blob>('/api/category/export', { params, responseType: 'blob' })
    .then((res) => res.data)
}

export function createCategory(payload: CreateCategoryRequest) {
  return apiClient.post<CategoryResponseDto>('/api/category', payload).then((res) => res.data)
}

export function updateCategory(id: string, payload: UpdateCategoryRequest) {
  return apiClient.patch<CategoryResponseDto>(`/api/category/${id}`, payload).then((res) => res.data)
}

export function activateCategory(id: string, locationId: string) {
  return apiClient.post<CategoryResponseDto>('/api/category/activate', { id, locationId }).then((res) => res.data)
}

export function deactivateCategory(id: string, locationId: string) {
  return apiClient.post<CategoryResponseDto>('/api/category/deactivate', { id, locationId }).then((res) => res.data)
}

export function addCategoryLocation(categoryId: string, locationId: string) {
  return apiClient.post<CategoryResponseDto>(`/api/category/${categoryId}/locations`, { locationId })
    .then((res) => res.data)
}

export function removeCategoryLocation(categoryId: string, locationId: string) {
  return apiClient.delete<CategoryResponseDto>(`/api/category/${categoryId}/locations/${locationId}`)
    .then((res) => res.data)
}
