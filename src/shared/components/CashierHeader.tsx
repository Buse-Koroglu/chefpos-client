import { Clock3, MapPin } from 'lucide-react'
import { useLiveClock } from '@/shared/hooks/useLiveClock'

interface CashierHeaderProps {
  title: string
  locationName: string
}

export function CashierHeader({ title, locationName }: CashierHeaderProps) {
  const { date, time } = useLiveClock()

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 uppercase">{title}</h1>

      <div className="flex items-center gap-4 text-sm text-zinc-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" />
          {locationName}
        </span>
        <span className="h-4 w-px bg-zinc-200" />
        <span className="flex items-center gap-1.5 tabular-nums">
          <Clock3 className="size-4" />
          {date} · {time}
        </span>
      </div>
    </header>
  )
}
