import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/shared/api/endpoints/users'

export function useActiveUsers() {
  return useQuery({
    queryKey: ['users', 'admin-picker'],
    queryFn: () => getUsers({ isActive: true, pageSize: 100 }),
  })
}
