export type CategoryStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface CategoryFilters {
  searchTerm: string
  locationId: string
  status: CategoryStatusFilter
}
