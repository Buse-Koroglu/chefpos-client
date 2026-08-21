import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'

const PENDING_REQUESTS_PAGE_SIZE = 200

export function usePendingRequestsByIngredient(locationId: string | undefined) {
  const query = useQuery({
    queryKey: ['stockRequests', 'stock-manager', 'pending-by-ingredient', locationId],
    queryFn: () =>
      getStockRequestsPaged({
        locationId,
        status: 'PENDING',
        pageNumber: 1,
        pageSize: PENDING_REQUESTS_PAGE_SIZE,
      }),
    enabled: Boolean(locationId),
  })

  const byIngredientId = useMemo(() => {
    const items = query.data?.items ?? []
    return new Map(items.map((request) => [request.ingredientId, request]))
  }, [query.data])

  return { ...query, byIngredientId }
}
