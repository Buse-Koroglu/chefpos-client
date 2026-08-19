export interface TableResponseDto {
  id: string
  tableNumber: number
  locationId: string
  isActive: boolean
}

export interface GetTablesPagedQueryParams {
  searchTerm?: string
  locationId?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface CreateTableRequest {
  locationId: string
  tableNumber: number
}

export interface UpdateTableRequest {
  tableNumber: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface GetTablesByLocationQueryParams {
  locationId: string
  includeInactive?: boolean
}