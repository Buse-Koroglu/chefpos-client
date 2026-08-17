import { apiClient } from '@/shared/api/client'
import type { LocationDto } from '@/shared/types/location'

export interface GetLocationsQueryParams {
  includeInactive?: boolean
}

export function getLocations(params: GetLocationsQueryParams = {}) {
  return apiClient.get<LocationDto[]>('/api/locations', { params }).then((res) => res.data)
}
