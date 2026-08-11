import { apiClient } from '@/shared/api/client'
import type { CategoryResponseDto, GetCategoriesQueryParams } from '@/shared/types/category'

export function getCategories(params: GetCategoriesQueryParams) {
  return apiClient.get<CategoryResponseDto[]>('/api/category', { params }).then((res) => res.data)
}
