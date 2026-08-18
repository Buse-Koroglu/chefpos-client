import { useQuery } from '@tanstack/react-query'
import { getCategoriesAdmin } from '@/shared/api/endpoints/categories'

const MAX_PAGE_SIZE = 100

export function useActiveCategories() {
  return useQuery({
    queryKey: ['categories', 'admin', 'active-for-product-form'],
    queryFn: async () => {
      const result = await getCategoriesAdmin({ isActive: true, pageNumber: 1, pageSize: MAX_PAGE_SIZE })
      return result.items
    },
  })
}
