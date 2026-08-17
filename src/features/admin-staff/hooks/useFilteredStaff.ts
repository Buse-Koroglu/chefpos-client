import { useMemo } from 'react'
import type { UserResponseDto } from '@/shared/types/auth'
import { STAFF_PAGE_SIZE } from '../constants'
import type { StaffFilters } from '../types'

export interface FilteredStaffResult {
  items: UserResponseDto[]
  totalCount: number
  totalPages: number
  pageNumber: number
}

export function useFilteredStaff(
  source: UserResponseDto[],
  filters: StaffFilters,
  pageNumber: number,
): FilteredStaffResult {
  return useMemo(() => {
    const filtered = source.filter((member) => {
      if (filters.role !== 'ALL' && !member.roles.includes(filters.role)) return false
      if (filters.status === 'ACTIVE' && !member.isActive) return false
      if (filters.status === 'INACTIVE' && member.isActive) return false
      if (filters.locationId !== 'ALL' && !member.locationIds.includes(filters.locationId)) return false
      return true
    })

    const totalCount = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalCount / STAFF_PAGE_SIZE))
    const safePageNumber = Math.min(Math.max(pageNumber, 1), totalPages)
    const start = (safePageNumber - 1) * STAFF_PAGE_SIZE
    const items = filtered.slice(start, start + STAFF_PAGE_SIZE)

    return { items, totalCount, totalPages, pageNumber: safePageNumber }
  }, [source, filters, pageNumber])
}
