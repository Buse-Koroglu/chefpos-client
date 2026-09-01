import { apiClient } from '@/shared/api/client'
import type { PagedResult } from '@/shared/types/pagination'
import type {CreateTableRequest,GetTablesPagedQueryRequest,TableResponseDto,UpdateTableRequest,GetTablesByLocationQueryRequest} from '@/shared/types/table'

export function getTablesPaged(params: GetTablesPagedQueryRequest) {
  return apiClient.get<PagedResult<TableResponseDto>>('/api/tables/paged', { params }).then((res) => res.data)
}

export type ExportTablesQueryRequest = Omit<GetTablesPagedQueryRequest, 'pageNumber' | 'pageSize'>

export function exportTables(params: ExportTablesQueryRequest): Promise<Blob> {
  return apiClient.get<Blob>('/api/tables/export', { params, responseType: 'blob' })
    .then((res) => res.data)
}

export function createTable(payload: CreateTableRequest) {
  return apiClient.post<TableResponseDto>('/api/tables', payload).then((res) => res.data)
}

export function updateTable(id: string, payload: UpdateTableRequest) {
  return apiClient.put<TableResponseDto>(`/api/tables/${id}`, payload).then((res) => res.data)
}

export function activateTable(id: string) {
  return apiClient.post<TableResponseDto>(`/api/tables/${id}/activate`).then((res) => res.data)
}

export function deactivateTable(id: string) {
  return apiClient.post<TableResponseDto>(`/api/tables/${id}/deactivate`).then((res) => res.data)
}

export function getTablesByLocation(params: GetTablesByLocationQueryRequest) {
  return apiClient.get<TableResponseDto[]>('/api/tables', { params }).then((res) => res.data)
}