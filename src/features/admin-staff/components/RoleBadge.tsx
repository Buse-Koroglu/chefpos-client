import type { Role } from '@/shared/types/auth'
import { ROLE_LABELS } from '../constants'

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
      {ROLE_LABELS[role]}
    </span>
  )
}
