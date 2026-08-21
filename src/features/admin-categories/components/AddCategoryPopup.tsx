import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { Check, ChevronDown, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import { createCategory } from '@/shared/api/endpoints/categories'
import { CategoryIcon } from './CategoryIcon'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  name?: string
  locationIds?: string
}

function validate(name: string, locationIds: string[]): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'Kategori adı zorunludur.'
  if (locationIds.length === 0) errors.locationIds = 'En az bir yerleşke seçmelisiniz.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 409) return 'Bu isimde bir kategori zaten kayıtlı.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Kategori oluşturulamadı. Lütfen tekrar deneyin.'
}

interface MultiSelectDropdownProps {
  label: string
  placeholder: string
  options: { id: string; label: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
  disabled?: boolean
  hasError?: boolean
}

function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selectedIds,
  onToggle,
  disabled,
  hasError,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      <label className="block text-xs font-medium text-zinc-600">{label}</label>

      {/* Tetikleyici Buton */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          FIELD_CLASSNAME,
          'flex items-center justify-between text-left cursor-pointer transition-all',
          hasError && 'border-red-300',
          isOpen && 'border-[#133458] ring-1 ring-[#133458]',
          disabled && 'opacity-60 cursor-not-allowed bg-zinc-50',
        )}
      >
        <span className="truncate text-zinc-600">
          {selectedIds.length === 0 ? placeholder : `${selectedIds.length} yerleşke seçildi`}
        </span>
        <ChevronDown
          className={cn('size-4 text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Açılır Liste */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto border border-zinc-200 bg-white shadow-lg">
          <div className="p-1 space-y-0.5">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onToggle(option.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left',
                    isSelected ? 'bg-[#133458]/10 text-[#133458]' : 'text-zinc-700 hover:bg-zinc-100',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="size-3.5 text-[#133458] shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Seçili Rozetler (Chips) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedIds.map((id) => {
            const opt = options.find((o) => o.id === id)
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 border border-[#133458] bg-[#133458] px-2 py-0.5 text-xs font-medium text-white"
              >
                {opt?.label ?? id}
                <button
                  type="button"
                  onClick={() => onToggle(id)}
                  disabled={disabled}
                  className="hover:opacity-75 focus:outline-none"
                >
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface AddCategoryPopupProps {
  open: boolean
  locations: LocationDto[]
  onClose: () => void
}

export function AddCategoryPopup({ open, locations, onClose }: AddCategoryPopupProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setName('')
    setIcon('')
    setLocationIds([])
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function toggleLocation(locationId: string) {
    setLocationIds((prev) =>
      prev.includes(locationId) ? prev.filter((value) => value !== locationId) : [...prev, locationId],
    )
  }

  async function handleSubmit() {
    const nextErrors = validate(name, locationIds)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createCategory({ name: name.trim(), icon: icon.trim() || null, locationIds })
      queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
      toast.success('Kategori başarıyla eklendi.')
      handleClose()
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  const locationOptions = locations.map((loc) => ({ id: loc.id, label: loc.name }))

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yeni Kategori Ekle
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-4">
            {submitError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kategori Adı</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Sıcak İçecekler"
                className={cn(FIELD_CLASSNAME, errors.name && 'border-red-300')}
                autoFocus
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">İkon (opsiyonel)</label>
              <div className="flex items-center gap-2">
                <span className="flex size-10 shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50">
                  <CategoryIcon icon={icon.trim() || null} />
                </span>
                <input
                  value={icon}
                  onChange={(event) => setIcon(event.target.value)}
                  placeholder="Örn. coffee"
                  className={FIELD_CLASSNAME}
                />
              </div>
            </div>

            {/* Yerleşkeler Multi-Select Dropdown */}
            <div>
              <MultiSelectDropdown
                label="Yerleşkeler"
                placeholder="Yerleşke seçiniz..."
                options={locationOptions}
                selectedIds={locationIds}
                onToggle={toggleLocation}
                disabled={isSubmitting}
                hasError={Boolean(errors.locationIds)}
              />
              {errors.locationIds && <p className="mt-1 text-xs text-red-600">{errors.locationIds}</p>}
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-200 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-none text-sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}