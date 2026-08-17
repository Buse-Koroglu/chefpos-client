import type { Role } from '@/shared/types/auth'

export type RoleFilter = Role | 'ALL'
export type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface StaffFilters {
  role: RoleFilter
  status: StatusFilter
  locationId: string
}
