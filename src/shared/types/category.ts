export interface GetCategoriesQueryRequest {
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

export interface GetCategoriesAdminQueryRequest {
  searchTerm?: string
  locationId?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
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

export type ExportCategoriesQueryRequest = Omit<GetCategoriesAdminQueryRequest, 'pageNumber' | 'pageSize'>
