import { useQuery } from '@tanstack/react-query'
import { getStockRequestsPaged } from '@/shared/api/endpoints/stockRequests'
import type { MyStockRequestsTab } from '../types'

export function useMyStockRequestsCount(locationId: string | undefined, tab: MyStockRequestsTab) {
  const { data } = useQuery({
    queryKey: ['stockRequests', 'my-count', tab, locationId],
    queryFn: () =>
      getStockRequestsPaged({
        locationId,
        onlyMyRequests: true,
        ...(tab === 'PENDING' ? { status: 'PENDING' as const } : { onlyHistory: true }),
        pageNumber: 1,
        pageSize: 1,
      }),
    enabled: Boolean(locationId),
  })

  return { total: data?.totalCount ?? 0 }
}