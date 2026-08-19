import { useQuery } from '@tanstack/react-query'
import { getTablesByLocation } from '@/shared/api/endpoints/tables'

export function useActiveTables(locationId: string | undefined) {
  return useQuery({
    queryKey: ['tables', 'active', locationId],
    queryFn: () => getTablesByLocation({ locationId: locationId!, includeInactive: false }),
    enabled: Boolean(locationId),
  })
}