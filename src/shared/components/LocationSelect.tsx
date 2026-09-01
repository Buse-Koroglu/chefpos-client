import { MapPin } from 'lucide-react'
import { BlockSelect } from './BlockSelect'

interface LocationOption {
  id: string
  name: string
}

interface LocationSelectProps {
  locations: LocationOption[]
  selectedLocationId: string | null
  onSelect: (locationId: string) => void
  direction?: 'up' | 'down'
}

// Yerleşke seçimi (native select yerine tall list item'lı custom dropdown)

export function LocationSelect({ locations, selectedLocationId, onSelect, direction = 'up' }: LocationSelectProps) {
  return (
    <BlockSelect
      options={locations.map((location) => ({ value: location.id, label: location.name }))}
      value={selectedLocationId}
      onChange={onSelect}
      icon={<MapPin className="size-5 shrink-0 text-zinc-400" />}
      placeholder="Yerleşke yok"
      direction={direction}
    />
  )
}
