export interface GetCategoriesQueryParams {
  locationId: string
  includeInactive?: boolean
}

export interface CategoryResponseDto {
  id: string
  name: string
  icon?: string | null
  isActive: boolean
  locationId: string
}
