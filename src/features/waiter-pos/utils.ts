import { getApiErrorCode } from '@/shared/api/apiError'

export function isTableOccupiedConflict(error: unknown): boolean {
  return getApiErrorCode(error) === 'TABLE_OCCUPIED' // boolean olarak o an seçilen masanın dolu olup olmadığını belirten fonksiyon
}
