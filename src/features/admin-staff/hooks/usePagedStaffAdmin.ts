import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getUsers } from '@/shared/api/endpoints/users'
import { STAFF_PAGE_SIZE } from '@/features/admin-staff/constants'
import type { StaffFilters, StatusFilter } from '@/features/admin-staff/types'

const REFETCH_TIME = 45_000

function toIsActiveParam(status: StatusFilter): boolean | undefined {
  if (status === 'ACTIVE') return true
  if (status === 'INACTIVE') return false
  return undefined
}

export function usePagedStaffAdmin(searchTerm: string, filters: StaffFilters, pageNumber: number) {
  return useQuery({
    queryKey: ['users', 'admin', searchTerm, filters.role, filters.status, filters.locationId, pageNumber],
    queryFn: () =>
      getUsers({
        searchTerm: searchTerm || undefined,
        role: filters.role === 'ALL' ? undefined : filters.role,
        isActive: toIsActiveParam(filters.status),
        locationId: filters.locationId === 'ALL' ? undefined : filters.locationId,
        pageNumber,
        pageSize: STAFF_PAGE_SIZE,
      }),
    refetchInterval: REFETCH_TIME,
    placeholderData: keepPreviousData,
  })
}
