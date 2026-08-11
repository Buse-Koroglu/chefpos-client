import { useQuery } from '@tanstack/react-query'
import { getCashierDashboard } from '@/shared/api/endpoints/dashboard'

export function useCashierDashboard(locationId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'cashier', locationId],
    queryFn: () => getCashierDashboard(locationId!),
    enabled: Boolean(locationId),
    refetchInterval: 60_000,
  })
}
