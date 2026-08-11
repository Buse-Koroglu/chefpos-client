import { apiClient } from '@/shared/api/client'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from '@/shared/types/auth'

export function login(payload: LoginRequest) {
  return apiClient.post<LoginResponse>('/api/auth/login', payload).then((res) => res.data)
}

export function refresh() {
  return apiClient.post<RefreshResponse>('/api/auth/refresh').then((res) => res.data)
}

export function logout() {
  return apiClient.post('/api/auth/logout')
}

export function changePassword(payload: ChangePasswordRequest) {
  return apiClient.post('/api/auth/change-password', payload)
}
