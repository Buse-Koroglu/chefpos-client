import { useQuery } from '@tanstack/react-query'
import { getWeeklyRevenue } from '@/shared/api/endpoints/dashboard'

export function useWeeklyRevenue(locationId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'weekly-revenue', locationId],
    queryFn: () => getWeeklyRevenue(locationId!),
    enabled: Boolean(locationId),
    refetchInterval: 60_000,
  })
}
