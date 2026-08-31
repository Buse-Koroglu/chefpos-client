import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}
// loading state için skeleton componenti
export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-zinc-200', className)} style={style} />
}
