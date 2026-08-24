import { apiClient } from '@/shared/api/client'
import type {
  AddProductToMenuRequest,
  CreateMenuRequest,
  CreateProductForMenuRequest,
  GetMenusQueryParams,
  MenuResponseDto,
  UpdateMenuRequest,
} from '@/shared/types/menu'
import type { ProductResponse } from '@/shared/types/product'

export function getMenus(params: GetMenusQueryParams) {
  return apiClient.get<MenuResponseDto[]>('/api/menus', { params }).then((res) => res.data)
}

export function getMenuById(id: string) {
  return apiClient.get<MenuResponseDto>(`/api/menus/${id}`).then((res) => res.data)
}

export function createMenu(payload: CreateMenuRequest) {
  return apiClient.post<MenuResponseDto>('/api/menus', payload).then((res) => res.data)
}

export function updateMenu(id: string, payload: UpdateMenuRequest) {
  return apiClient.patch<MenuResponseDto>(`/api/menus/${id}`, payload).then((res) => res.data)
}

export function activateMenu(id: string) {
  return apiClient.post<MenuResponseDto>(`/api/menus/${id}/activate`).then((res) => res.data)
}

export function deactivateMenu(id: string) {
  return apiClient.post<MenuResponseDto>(`/api/menus/${id}/deactivate`).then((res) => res.data)
}

export function addProductToMenu(menuId: string, payload: AddProductToMenuRequest) {
  return apiClient.post<MenuResponseDto>(`/api/menus/${menuId}/products`, payload).then((res) => res.data)
}

export function createProductForMenu(menuId: string, payload: CreateProductForMenuRequest) {
  return apiClient.post<ProductResponse>(`/api/menus/${menuId}/products/new`, payload).then((res) => res.data)
}

export function removeProductFromMenu(menuId: string, productId: string) {
  return apiClient.delete<MenuResponseDto>(`/api/menus/${menuId}/products/${productId}`).then((res) => res.data)
}
