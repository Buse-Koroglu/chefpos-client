import { Menu } from 'lucide-react'

interface WaiterHeaderProps {
  locationName: string
  onMenuClick: () => void
}

export function WaiterHeader({ locationName, onMenuClick }: WaiterHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Menü" className="text-zinc-900">
          <Menu className="size-5" />
        </button>
        <span className="text-base font-semibold tracking-tight text-zinc-900">ChefPos Terminal</span>
      </div>
      <span className="text-sm font-medium text-zinc-500">{locationName}</span>
    </header>
  )
}