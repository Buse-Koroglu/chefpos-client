import { useEffect, useRef, useState } from 'react'
import { ImageOff, Loader2, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Sadece JPG, PNG veya WEBP formatında görsel yükleyebilirsiniz.'
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'Dosya boyutu 5MB sınırını aşıyor.'
  }
  return null
}

interface ImageUploadInputProps {
  file: File | null
  onFileChange: (file: File | null) => void
  existingImageUrl?: string | null
  onRemoveExisting?: () => void
  disabled?: boolean
  uploading?: boolean
  uploadProgress?: number
  size?: 'sm' | 'lg'
}

export function ImageUploadInput({
  file,
  onFileChange,
  existingImageUrl,
  onRemoveExisting,
  disabled = false,
  uploading = false,
  uploadProgress,
  size = 'lg',
}: ImageUploadInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const sizeClassName = size === 'sm' ? 'size-9' : 'size-24'
  const iconSizeClassName = size === 'sm' ? 'size-4' : 'size-6'

  const resolvedExistingUrl = resolveImageUrl(existingImageUrl)
  const displayUrl = previewUrl ?? resolvedExistingUrl

  function handleFiles(fileList: FileList | null) {
    const selected = fileList?.[0]
    if (!selected) return

    const validationError = validateFile(selected)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onFileChange(selected)
  }

  function handleRemove(event: React.MouseEvent) {
    event.stopPropagation()
    setError(null)
    if (file) {
      onFileChange(null)
      return
    }
    onRemoveExisting?.()
  }

  return (
    <div className="flex items-center gap-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (!disabled) handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition-colors',
          sizeClassName,
          !disabled && 'cursor-pointer hover:border-[#133458] hover:text-[#133458]',
          isDragging && 'border-[#133458] bg-[#133458]/5 text-[#133458]',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          disabled={disabled}
          onChange={(event) => handleFiles(event.target.files)}
          className="hidden"
        />

        {displayUrl ? (
          <img src={displayUrl} alt="" className="size-full object-cover" />
        ) : (
          <UploadCloud className={iconSizeClassName} />
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className={cn(iconSizeClassName, 'animate-spin text-[#133458]')} />
          </div>
        )}

        {displayUrl && !uploading && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Görseli kaldır"
            className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-zinc-900/70 text-white hover:bg-zinc-900"
          >
            <X className="size-2.5" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-1">
        <p className="text-xs text-zinc-500">
          Sürükleyip bırakın ya da <span className="font-medium text-[#133458]">tıklayarak seçin</span>. JPG, PNG,
          WEBP — max 5MB.
        </p>
        {uploading && typeof uploadProgress === 'number' && (
          <div className="h-1 w-full max-w-40 overflow-hidden bg-zinc-200">
            <div className="h-full bg-[#133458] transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <ImageOff className="size-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
