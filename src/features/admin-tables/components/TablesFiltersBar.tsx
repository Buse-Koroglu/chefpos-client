import type { TableStatusFilter } from '@/features/admin-tables/types'

const SELECT_CLASSNAME = 'h-9 border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none transition-colors focus-visible:border-zinc-400'

interface TablesFiltersBarProps {
  status: TableStatusFilter
  onStatusChange: (status: TableStatusFilter) => void
}

export function TablesFiltersBar({ status, onStatusChange }: TablesFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as TableStatusFilter)}
        className={SELECT_CLASSNAME}
      >
        <option value="ALL">Hepsi</option>
        <option value="ACTIVE">Aktif</option>
        <option value="INACTIVE">Pasif</option>
      </select>
    </div>
  )
}
