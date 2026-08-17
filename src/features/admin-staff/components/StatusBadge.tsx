import { cn } from '@/lib/utils'

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-xs font-medium',
        isActive ? 'border-[#84994F]/30 bg-[#84994F]/10 text-[#708243]' : 'border-destructive/30 bg-destructive/10 text-destructive',
      )}
    >
      {isActive ? 'Aktif' : 'Pasif'}
    </span>
  )
}
