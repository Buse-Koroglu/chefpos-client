import { useQuery } from '@tanstack/react-query'
import { getAdminDashboardSummary } from '@/shared/api/endpoints/dashboard'

export function useDashboardSummary(locationId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'admin-summary', locationId],
    queryFn: () => getAdminDashboardSummary(locationId!),
    enabled: Boolean(locationId),
    refetchInterval: 60_000, // dashboard verisini 60 sn'de bir refetch eder
  })
}
