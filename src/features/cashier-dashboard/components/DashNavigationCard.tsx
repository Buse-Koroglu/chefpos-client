import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface DashNavigationCardProps {
  title: string
  description: string
  actionLabel: string
  icon: LucideIcon
  onClick?: () => void
}

export function DashNavigationCard({ title, description, actionLabel, icon: Icon, onClick }: DashNavigationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-1 items-center justify-between gap-4 border-2 border-zinc-300 bg-white p-5 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center bg-[#133458] text-white">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-base font-semibold text-zinc-800">{title}</p>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>

      <span className="flex shrink-0 items-center gap-1.5 border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors group-hover:border-zinc-300 group-hover:bg-white">
        {actionLabel}
        <ArrowRight className="size-4" />
      </span>
    </button>
  )
}
