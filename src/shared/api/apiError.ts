import { isAxiosError } from 'axios'
import type { ApiProblemDetails } from '@/shared/types/auth'

export function getApiErrorMessage(error: unknown, fallback = 'Bir hata oluştu.'): string {
  if (isAxiosError<ApiProblemDetails>(error)) {
    const detail = error.response?.data?.detail
    if (detail) return detail
  }
  return fallback
}
