import { apiClient } from '@/shared/api/client'
import { mapUserResponse } from '@/shared/types/auth'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RawLoginResponse,
  RefreshResponse,
} from '@/shared/types/auth'

export function login(payload: LoginRequest) {
  return apiClient
    .post<RawLoginResponse>('/api/auth/login', payload)
    .then((res): LoginResponse => ({ ...res.data, user: mapUserResponse(res.data.user) }))
}

export function refresh() {
  return apiClient
    .post<RawLoginResponse>('/api/auth/refresh')
    .then((res): RefreshResponse => ({ ...res.data, user: mapUserResponse(res.data.user) }))
}

export function logout() {
  return apiClient.post('/api/auth/logout')
}

export function changePassword(payload: ChangePasswordRequest) {
  return apiClient.post('/api/auth/change-password', payload)
}
