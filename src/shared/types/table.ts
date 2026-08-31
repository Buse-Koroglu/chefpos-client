export interface TableResponseDto {
  id: string
  tableNumber: number
  locationId: string
  isActive: boolean
}

export interface GetTablesPagedQueryRequest {
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

export interface GetTablesByLocationQueryRequest {
  locationId: string
  includeInactive?: boolean
}