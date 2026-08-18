import { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import { createTable } from '@/shared/api/endpoints/tables'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  locationId?: string
  tableNumber?: string
}

function validate(locationId: string, tableNumber: string): FormErrors {
  const errors: FormErrors = {}
  if (!locationId) errors.locationId = 'Yerleşke seçmelisiniz.'
  if (tableNumber.trim() === '' || Number(tableNumber) <= 0) errors.tableNumber = 'Geçerli bir masa numarası girin.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) return error.response?.data?.detail ?? 'Bu numarada bir masa zaten mevcut.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Masa oluşturulamadı. Lütfen tekrar deneyin.'
}

interface AddTablePopupProps {
  open: boolean
  locations: LocationDto[]
  onClose: () => void
}

export function AddTablePopup({ open, locations, onClose }: AddTablePopupProps) {
  const queryClient = useQueryClient()

  const [locationId, setLocationId] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setLocationId('')
    setTableNumber('')
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    const nextErrors = validate(locationId, tableNumber)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createTable({ locationId, tableNumber: Number(tableNumber) })
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: false })
      toast.success('Masa başarıyla eklendi.')
      handleClose()
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">Yeni Masa Ekle</Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-4">
            {submitError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
              <select
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
                className={cn(FIELD_CLASSNAME, errors.locationId && 'border-red-300')}
              >
                <option value="">Yerleşke seçin</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.locationId && <p className="mt-1 text-xs text-red-600">{errors.locationId}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Masa Numarası</label>
              <input
                value={tableNumber}
                onChange={(event) => setTableNumber(event.target.value)}
                type="number"
                min="1"
                step="1"
                placeholder="Örn. 12"
                className={cn(FIELD_CLASSNAME, errors.tableNumber && 'border-red-300')}
                autoFocus
              />
              {errors.tableNumber && <p className="mt-1 text-xs text-red-600">{errors.tableNumber}</p>}
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
