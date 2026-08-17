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

export interface GetLocationsPagedQueryParams {
  searchTerm?: string
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

export interface CreateLocationRequest {
  name: string
}

export interface UpdateLocationRequest {
  name: string
}
