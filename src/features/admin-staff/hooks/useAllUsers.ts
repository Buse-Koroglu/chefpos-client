import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/shared/api/endpoints/users'

const INITIAL_PAGE_SIZE = 100

export function useAllUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const first = await getUsers({ pageNumber: 1, pageSize: INITIAL_PAGE_SIZE })
      if (first.totalCount <= first.items.length) return first.items

      console.warn(
        `useAllUsers: staff count (${first.totalCount}) exceeds initial page size (${INITIAL_PAGE_SIZE}), refetching full list`,
      )
      const all = await getUsers({ pageNumber: 1, pageSize: first.totalCount })
      return all.items
    },
  })
}
