import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/shared/stores/authStore'
import type { RefreshResponse } from '@/shared/types/auth'

const AUTH_PATHS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout']

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function resolveQueue(token: string | null) {
  pendingQueue.forEach((resolve) => resolve(token))
  pendingQueue = []
}

function forceLogout() {
  useAuthStore.getState().logout()
  toast.error('Oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.')
  window.location.href = '/login'
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    const isAuthPath = AUTH_PATHS.some((path) =>
      originalRequest?.url?.includes(path),
    )

    if (error.response?.status !== 401 || !originalRequest || isAuthPath) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      forceLogout()
      return Promise.reject(error)
    }
    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(error)
            return
          }
          originalRequest.headers.set('Authorization', `Bearer ${token}`)
          resolve(apiClient(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await apiClient.post<RefreshResponse>('/api/auth/refresh')
      useAuthStore.getState().setSession(data.accessToken, data.user)
      resolveQueue(data.accessToken)
      originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`)
      return apiClient(originalRequest)
    } catch (refreshError) {
      resolveQueue(null)
      forceLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
