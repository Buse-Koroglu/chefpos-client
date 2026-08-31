import type { Role, UserResponseDto } from '@/shared/types/auth'

export interface GetUsersQueryRequest {
  searchTerm?: string
  role?: Role
  isActive?: boolean
  locationId?: string
  pageNumber?: number
  pageSize?: number
}

export interface GetUsersResult {
  items: UserResponseDto[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export type ExportUsersQueryRequest = Omit<GetUsersQueryRequest, 'pageNumber' | 'pageSize'>

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
