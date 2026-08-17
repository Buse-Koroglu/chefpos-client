import { apiClient } from '@/shared/api/client'
import { ROLES } from '@/shared/types/auth'
import type { Role, UserResponseDto } from '@/shared/types/auth'

interface RawUserPayload {
  id: string
  personalId: string
  firstName: string
  lastName: string
  roles: Array<number | Role>
  isFirstLogin: boolean
  isActive: boolean
  locationIds: string[]
  generatedPassword?: string | null
}

function normalizeUser(raw: RawUserPayload): UserResponseDto {
  return {
    id: raw.id,
    personalId: raw.personalId,
    firstName: raw.firstName,
    lastName: raw.lastName,
    roles: (raw.roles ?? []).map((role) => (typeof role === 'number' ? ROLES[role] : role)),
    isFirstLogin: raw.isFirstLogin,
    isActive: raw.isActive,
    locationIds: raw.locationIds ?? [],
  }
}

export interface GetUsersQueryParams {
  role?: Role
  isActive?: boolean
  locationId?: string
  pageNumber?: number
  pageSize?: number
}

export interface GetUsersResult {
  items: UserResponseDto[]
  totalCount: number
}

export function getUsers(params: GetUsersQueryParams): Promise<GetUsersResult> {
  return apiClient
    .get<RawUserPayload[] | { items: RawUserPayload[]; totalCount?: number }>('/api/users', { params })
    .then((res) => {
      const data = res.data
      const items = (Array.isArray(data) ? data : data.items).map(normalizeUser)
      const totalCount = Array.isArray(data) ? items.length : (data.totalCount ?? items.length)
      return { items, totalCount }
    })
}

export function getUserById(id: string) {
  return apiClient.get<RawUserPayload>(`/api/users/${id}`).then((res) => normalizeUser(res.data))
}

export interface CreateUserRequest {
  personalId: string
  firstName: string
  lastName: string
  roles: Role[]
}

export interface CreateUserResult {
  user: UserResponseDto
  generatedPassword: string | null
}

export function createUser(payload: CreateUserRequest) {
  return apiClient
    .post<RawUserPayload>('/api/users', {
      personalId: payload.personalId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.roles.map((role) => ROLES.indexOf(role)),
    })
    .then(
      (res): CreateUserResult => ({
        user: normalizeUser(res.data),
        generatedPassword: res.data.generatedPassword ?? null,
      }),
    )
}

export function assignLocationAccess(userId: string, locationId: string) {
  return apiClient
    .post<RawUserPayload>(`/api/users/${userId}/locations`, { locationId })
    .then((res) => normalizeUser(res.data))
}

export function revokeLocationAccess(userId: string, locationId: string) {
  return apiClient
    .delete<RawUserPayload>(`/api/users/${userId}/locations/${locationId}`)
    .then((res) => normalizeUser(res.data))
}

export function addRole(userId: string, role: Role) {
  return apiClient
    .post<RawUserPayload>(`/api/users/${userId}/roles`, { role: ROLES.indexOf(role) })
    .then((res) => normalizeUser(res.data))
}

export function removeRole(userId: string, role: Role) {
  return apiClient.delete<RawUserPayload>(`/api/users/${userId}/roles/${role}`).then((res) => normalizeUser(res.data))
}

export function activateUser(userId: string) {
  return apiClient.post<RawUserPayload>(`/api/users/${userId}/activate`).then((res) => normalizeUser(res.data))
}

export function deactivateUser(userId: string) {
  return apiClient.post<RawUserPayload>(`/api/users/${userId}/deactivate`).then((res) => normalizeUser(res.data))
}
