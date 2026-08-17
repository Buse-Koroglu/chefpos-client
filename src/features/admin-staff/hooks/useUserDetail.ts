import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/shared/api/endpoints/users'

export function useUserDetail(userId: string | undefined) {
  return useQuery({
    queryKey: ['users', 'detail', userId],
    queryFn: () => getUserById(userId!),
    enabled: Boolean(userId),
  })
}
