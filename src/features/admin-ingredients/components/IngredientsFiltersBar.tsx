import type { LocationDto } from '@/shared/types/location'
import type { IngredientStatusFilter } from '@/features/admin-ingredients/types'

const SELECT_CLASSNAME =
  'h-9 border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none transition-colors focus-visible:border-zinc-400'

interface IngredientsFiltersBarProps {
  locationId: string
  status: IngredientStatusFilter
  locations: LocationDto[]
  onLocationChange: (locationId: string) => void
  onStatusChange: (status: IngredientStatusFilter) => void
  hideLocationFilter?: boolean
}

export function IngredientsFiltersBar({ locationId, status, locations, onLocationChange, onStatusChange, hideLocationFilter }: IngredientsFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      {!hideLocationFilter && (
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
      )}

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as IngredientStatusFilter)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Hepsi</option>
        <option value="ACTIVE">Aktif</option>
        <option value="INACTIVE">Pasif</option>
      </select>
    </div>
  )
}
