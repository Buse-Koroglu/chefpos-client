import { ImageOff } from 'lucide-react'
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl'

interface ProductImagePreviewProps {
  imageUrl: string | null | undefined
  size?: 'sm' | 'lg'
}

export function ProductImagePreview({ imageUrl, size = 'sm' }: ProductImagePreviewProps) {
  const sizeClassName = size === 'sm' ? 'size-9' : 'size-24'
  const resolvedUrl = resolveImageUrl(imageUrl)

  if (!resolvedUrl) {
    return (
      <div className={`flex ${sizeClassName} shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-300`}>
        <ImageOff className={size === 'sm' ? 'size-4' : 'size-8'} />
      </div>
    )
  }

  return (
    <img
      src={resolvedUrl}
      alt=""
      className={`${sizeClassName} shrink-0 border border-zinc-200 object-cover`}
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  )
}
