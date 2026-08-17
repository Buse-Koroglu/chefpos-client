import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/shared/components/Skeleton'

interface AdminInfoCardProps {
  label: string
  value: string
  icon: LucideIcon
  isLoading?: boolean
}

export function AdminInfoCard({ label, value, icon: Icon, isLoading }: AdminInfoCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-2 border-zinc-300 bg-white p-4">
      <div className="min-w-0">
        <p className="text-sm text-zinc-500">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-7 w-28" />
        ) : (
          <p className="mt-1 truncate text-2xl font-semibold text-zinc-700">{value}</p>
        )}
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center bg-zinc-100 text-zinc-700">
        <Icon className="size-5" />
      </span>
    </div>
  )
}
