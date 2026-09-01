export interface LocationDto {
  id: string
  name: string
  isActive: boolean
}

export interface LocationResponseDto {
  id: string
  name: string
  isActive: boolean
  employeeCount: number
}

export interface GetLocationsPagedQueryRequest {
  searchTerm?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface GetLocationsQueryRequest {
  includeInactive?: boolean
}

export interface CreateLocationRequest {
  name: string
}

export interface UpdateLocationRequest {
  name: string
}
