import type { LucideIcon } from 'lucide-react'

interface DashInfoCardProps {
  label: string
  value: string
  icon: LucideIcon
}

export function DashInfoCard({ label, value, icon: Icon }: DashInfoCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-2 border-zinc-300 bg-white p-4">
      <div className="min-w-0">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-1 truncate text-2xl font-semibold text-zinc-700">{value}</p>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center bg-zinc-100 text-zinc-700">
        <Icon className="size-5" />
      </span>
    </div>
  )
}
