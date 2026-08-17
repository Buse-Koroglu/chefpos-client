import { apiClient } from '@/shared/api/client'
import type {
  CreateLocationRequest,
  GetLocationsPagedQueryParams,
  LocationDto,
  LocationResponseDto,
  PagedResult,
  UpdateLocationRequest,
} from '@/shared/types/location'

export interface GetLocationsQueryParams {
  includeInactive?: boolean
}

const MAX_PAGE_SIZE = 100

function toLocationDto(location: LocationResponseDto): LocationDto {
  return { id: location.id, name: location.name, isActive: location.isActive }
}

/** Convenience wrapper over `getLocationsPaged` for callers that just need a flat list (dropdowns, chip pickers). */
export function getLocations(params: GetLocationsQueryParams = {}) {
  return getLocationsPaged({
    isActive: params.includeInactive ? undefined : true,
    pageNumber: 1,
    pageSize: MAX_PAGE_SIZE,
  }).then((result) => result.items.map(toLocationDto))
}

export function getLocationsPaged(params: GetLocationsPagedQueryParams) {
  return apiClient.get<PagedResult<LocationResponseDto>>('/api/locations', { params }).then((res) => res.data)
}

export function createLocation(payload: CreateLocationRequest) {
  return apiClient.post<LocationResponseDto>('/api/locations', payload).then((res) => res.data)
}

export function updateLocation(id: string, payload: UpdateLocationRequest) {
  return apiClient.put<LocationResponseDto>(`/api/locations/${id}`, payload).then((res) => res.data)
}

export function activateLocation(id: string) {
  return apiClient.post<LocationResponseDto>(`/api/locations/${id}/activate`).then((res) => res.data)
}

export function deactivateLocation(id: string) {
  return apiClient.post<LocationResponseDto>(`/api/locations/${id}/deactivate`).then((res) => res.data)
}
