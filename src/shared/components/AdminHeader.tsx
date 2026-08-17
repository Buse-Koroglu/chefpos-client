import type { ReactNode } from 'react'
import { Clock3 } from 'lucide-react'
import { useLiveClock } from '@/shared/hooks/useLiveClock'

interface AdminHeaderProps {
  title: string
  actions?: ReactNode
}

export function AdminHeader({ title, actions }: AdminHeaderProps) {
  const { date, time } = useLiveClock()

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 uppercase">{title}</h1>

      <div className="flex items-center gap-4">
        {actions}
        <span className="flex items-center gap-1.5 text-sm tabular-nums text-zinc-500">
          <Clock3 className="size-4" />
          {date} · {time}
        </span>
      </div>
    </header>
  )
}
