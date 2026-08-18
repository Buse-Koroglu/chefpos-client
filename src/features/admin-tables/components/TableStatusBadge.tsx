import { cn } from '@/lib/utils'

export function TableStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium',
        isActive ? 'border-[#84994F]/30 bg-[#84994F]/10 text-[#708243]' : 'border-destructive/30 bg-destructive/10 text-destructive',
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', isActive ? 'bg-[#84994F]' : 'bg-destructive')} />
      {isActive ? 'Aktif' : 'Pasif'}
    </span>
  )
}
