import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type DashInfoCardAccent = 'amber' | 'primary'

interface DashInfoCardProps {
  label: string
  value: string
  icon: LucideIcon
  accent?: DashInfoCardAccent
}

const ACCENT_CLASSNAME: Record<DashInfoCardAccent, { border: string; icon: string }> = {
  amber: { border: 'border-amber-300', icon: 'bg-amber-100 text-amber-700' },
  primary: { border: 'border-[#133458]/30', icon: 'bg-[#133458]/10 text-[#133458]' },
}

export function DashInfoCard({ label, value, icon: Icon, accent = 'primary' }: DashInfoCardProps) {
  const { border, icon } = ACCENT_CLASSNAME[accent]

  return (
    <div className={cn('flex items-center justify-between gap-4 border-2 bg-white p-6', border)}>
      <div className="min-w-0">
        <p className="text-lg text-zinc-600">{label}</p>
        <p className="mt-1 truncate text-3xl font-bold text-zinc-800">{value}</p>
      </div>
      <span className={cn('flex size-16 shrink-0 items-center justify-center', icon)}>
        <Icon className="size-8" />
      </span>
    </div>
  )
}
