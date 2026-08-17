export interface GetCategoriesQueryParams {
  locationId: string
  includeInactive?: boolean
}

export interface CategoryResponseDto {
  id: string
  name: string
  icon?: string | null
  isActive: boolean
  locationIds: string[]
}

export interface CategoryAdminResponseDto {
  id: string
  name: string
  icon: string | null
  isActive: boolean
  locationIds: string[]
  locationNames: string[]
  productCount: number
}

export interface GetCategoriesAdminQueryParams {
  searchTerm?: string
  locationId?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface CreateCategoryRequest {
  name: string
  icon?: string | null
  locationIds: string[]
}

export interface UpdateCategoryRequest {
  name: string
  icon?: string | null
}
