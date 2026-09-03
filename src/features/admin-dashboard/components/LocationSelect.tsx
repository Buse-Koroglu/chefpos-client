import { MapPin } from 'lucide-react'
import type { LocationDto } from '@/shared/types/location'

interface LocationSelectProps {
  locations: LocationDto[]
  value: string | undefined
  onChange: (locationId: string) => void
  disabled?: boolean
}

export function LocationSelect({ locations, value, onChange, disabled }: LocationSelectProps) {
  return (
    <label className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
      <MapPin className="size-4 shrink-0 text-zinc-400" />
      <select
        value={value ?? ''}
        disabled={disabled || locations.length === 0}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent text-sm text-zinc-900 outline-none disabled:text-zinc-400"
      >
        {locations.length === 0 && <option value="">Yerleşke yok</option>}
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </label>
  )
}
