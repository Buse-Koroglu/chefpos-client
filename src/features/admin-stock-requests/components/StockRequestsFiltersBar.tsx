import type { LocationDto } from '@/shared/types/location'
import { STOCK_REQUEST_STATUS_LABELS, STOCK_REQUEST_STATUSES } from '@/shared/types/stockRequest'
import type { StockRequestStatusFilter } from '@/features/admin-stock-requests/types'

const SELECT_CLASSNAME =
  'h-9 border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none transition-colors focus-visible:border-zinc-400'

interface StockRequestsFiltersBarProps {
  locationId: string
  status: StockRequestStatusFilter
  locations: LocationDto[]
  onLocationChange: (locationId: string) => void
  onStatusChange: (status: StockRequestStatusFilter) => void
}

export function StockRequestsFiltersBar({
  locationId,
  status,
  locations,
  onLocationChange,
  onStatusChange,
}: StockRequestsFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={locationId}
        onChange={(event) => onLocationChange(event.target.value)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Tüm Yerleşkeler</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as StockRequestStatusFilter)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Tümü</option>
        {STOCK_REQUEST_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STOCK_REQUEST_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  )
}
