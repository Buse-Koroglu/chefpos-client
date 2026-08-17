import type { LocationDto } from '@/shared/types/location'
import { ROLE_LABELS, ROLE_OPTIONS } from '../constants'
import type { RoleFilter, StatusFilter } from '../types'

const SELECT_CLASSNAME =
  'h-9 border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none transition-colors focus-visible:border-zinc-400'

interface StaffFiltersBarProps {
  role: RoleFilter
  status: StatusFilter
  locationId: string
  locations: LocationDto[]
  onRoleChange: (role: RoleFilter) => void
  onStatusChange: (status: StatusFilter) => void
  onLocationChange: (locationId: string) => void
}

export function StaffFiltersBar({
  role,
  status,
  locationId,
  locations,
  onRoleChange,
  onStatusChange,
  onLocationChange,
}: StaffFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={(event) => onRoleChange(event.target.value as RoleFilter)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Tüm Roller</option>
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {ROLE_LABELS[option]}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Tümü</option>
        <option value="ACTIVE">Aktif</option>
        <option value="INACTIVE">Pasif</option>
      </select>

      <select
        value={locationId}
        onChange={(event) => onLocationChange(event.target.value)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Tüm Lokasyonlar</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  )
}
