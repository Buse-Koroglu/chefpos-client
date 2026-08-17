import type { LocationStatusFilter } from '@/features/admin-locations/types'

const SELECT_CLASSNAME =
  'h-9 border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none transition-colors focus-visible:border-zinc-400'

interface LocationsStatusFilterProps {
  value: LocationStatusFilter
  onChange: (value: LocationStatusFilter) => void
}

export function LocationsStatusFilter({ value, onChange }: LocationsStatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as LocationStatusFilter)}
      className={SELECT_CLASSNAME}
    >
      <option value="ALL">Hepsi</option>
      <option value="ACTIVE">Aktif</option>
      <option value="INACTIVE">Pasif</option>
    </select>
  )
}
