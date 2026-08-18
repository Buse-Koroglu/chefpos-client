import type { LocationResponseDto } from '@/shared/types/location'
import { Skeleton } from '@/shared/components/Skeleton'
import { LocationStatusBadge } from './LocationStatusBadge'

interface LocationsTableProps {
  locations: LocationResponseDto[]
  onSelect: (locationId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Yerleşke Adı</th>
    <th className="px-4 py-3">Personel Sayısı</th>
    <th className="px-4 py-3">Durum</th>
  </tr>
)

export function LocationsTable({ locations, onSelect, isLoading }: LocationsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 3 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Aradığınız kriterlere uygun sonuç bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {locations.map((location) => (
            <tr
              key={location.id}
              onClick={() => onSelect(location.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">{location.name}</td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">{location.employeeCount}</td>
              <td className="px-4 py-3">
                <LocationStatusBadge isActive={location.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
