import type { useQueryClient } from '@tanstack/react-query'
import { getApiErrorCode } from '@/shared/api/apiError'
import { getStockManagerByLocation } from '@/shared/api/endpoints/users'
import type { UserResponseDto } from '@/shared/types/auth'

export function isStockManagerConflict(error: unknown): boolean {
  return getApiErrorCode(error) === 'STOCK_MANAGER_CONFLICT'
}

export class StockManagerPrecheckError extends Error {}

export async function findStockManagerConflictMessage(
  locationIds: string[],
  locationsById: Map<string, string>,
  excludeUserId?: string,
): Promise<string | null> {
  if (locationIds.length === 0) return null

  const existingManagers = await Promise.all(
    locationIds.map((locationId) => getStockManagerByLocation(locationId)),
  )
  const conflictIndex = existingManagers.findIndex(
    (manager) => manager !== null && manager.id !== excludeUserId,
  )
  if (conflictIndex === -1) return null

  const manager = existingManagers[conflictIndex]!
  const locationName = locationsById.get(locationIds[conflictIndex]) ?? ''
  return `${locationName} yerleşkesinde zaten bir Stok Yöneticisi atanmış: ${manager.firstName} ${manager.lastName}.`
}

export function addUserToCache(queryClient: ReturnType<typeof useQueryClient>, user: UserResponseDto) {
  queryClient.setQueryData(['users', 'detail', user.id], user)
  queryClient.setQueriesData<UserResponseDto[]>({ queryKey: ['users'], exact: false }, (old) =>
    Array.isArray(old) ? [user, ...old.filter((member) => member.id !== user.id)] : old,
  )
}

export function updateUserInCache(queryClient: ReturnType<typeof useQueryClient>, user: UserResponseDto) {
  queryClient.setQueryData(['users', 'detail', user.id], user)
  queryClient.setQueriesData<UserResponseDto[]>({ queryKey: ['users'], exact: false }, (old) =>
    Array.isArray(old) ? old.map((member) => (member.id === user.id ? user : member)) : old,
  )
}
