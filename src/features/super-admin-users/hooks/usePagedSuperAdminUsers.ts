import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getUsers } from '@/shared/api/endpoints/users'

const SUPER_ADMIN_USERS_PAGE_SIZE = 20

export function usePagedSuperAdminUsers(searchTerm: string, pageNumber: number) {
  return useQuery({
    queryKey: ['users', 'super-admin', searchTerm, pageNumber],
    queryFn: () =>
      getUsers({
        searchTerm: searchTerm || undefined,
        pageNumber,
        pageSize: SUPER_ADMIN_USERS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
