export type LocationStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface LocationFilters {
  searchTerm: string
  status: LocationStatusFilter
}
