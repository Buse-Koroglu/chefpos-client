import { Tag } from 'lucide-react'
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic'
import { cn } from '@/lib/utils'

const KNOWN_ICON_NAMES = new Set<string>(iconNames)

function isKnownIconName(icon: string): icon is IconName {
  return KNOWN_ICON_NAMES.has(icon)
}

interface CategoryIconProps {
  icon: string | null
  className?: string
}

export function CategoryIcon({ icon, className }: CategoryIconProps) {
  const resolvedClassName = cn('size-4 shrink-0 text-zinc-500', className)

  if (icon && isKnownIconName(icon)) {
    return <DynamicIcon name={icon} className={resolvedClassName} fallback={() => <Tag className={resolvedClassName} />} />
  }

  return <Tag className={resolvedClassName} />
}
