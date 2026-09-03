import { useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import { useAuthStore } from '@/shared/stores/authStore'
import { useCreateTable } from '@/features/admin-tables/hooks/useCreateTable'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  tableNumber?: string
}

function validate(tableNumber: string): FormErrors {
  const errors: FormErrors = {}
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
  const createTableMutation = useCreateTable()

  const adminLocationId = useAuthStore((state) => state.user?.locationIds[0])
  const adminLocationName = locations.find((location) => location.id === adminLocationId)?.name ?? '—'

  const [tableNumber, setTableNumber] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isSubmitting = createTableMutation.isPending

  function reset() {
    setTableNumber('')
    setErrors({})
    setSubmitError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    const nextErrors = validate(tableNumber)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !adminLocationId) return

    setSubmitError(null)

    try {
      await createTableMutation.mutateAsync({ locationId: adminLocationId, tableNumber: Number(tableNumber) })
      handleClose()
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
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
              <input value={adminLocationName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
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
