import type { Role } from '@/shared/types/auth'
import { ROLE_LABELS } from '../constants'

interface RoleBadgeProps {
  role: Role
  locationName?: string
}

export function RoleBadge({ role, locationName }: RoleBadgeProps) {
  return (
    <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
      {ROLE_LABELS[role]}
      {locationName && <span className="text-zinc-400"> · {locationName}</span>}
    </span>
  )
}
