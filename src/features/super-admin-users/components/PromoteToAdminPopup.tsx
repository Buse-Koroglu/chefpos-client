import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { ExistingAdminError, usePromoteToAdmin } from '@/features/super-admin-users/hooks/usePromoteToAdmin'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface PromoteToAdminPopupProps {
  userId: string | null
  userName: string
  locations: LocationDto[]
  onClose: () => void
}

export function PromoteToAdminPopup({ userId, userName, locations, onClose }: PromoteToAdminPopupProps) {
  const promoteMutation = usePromoteToAdmin()
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = promoteMutation.isPending

  function reset() {
    setLocationId('')
    setError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit() {
    if (!userId) return
    if (!locationId) {
      setError('Yerleşke seçimi zorunludur.')
      return
    }

    setError(null)

    promoteMutation.mutate(
      { userId, locationId },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: (err) => {
          setError(
            err instanceof ExistingAdminError ? err.message : getApiErrorMessage(err, 'Yönetici ataması yapılamadı.'),
          )
        },
      },
    )
  }

  return (
    <Dialog.Root open={Boolean(userId)} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yönetici Yap
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-4">
            {error && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

            <p className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-900">{userName}</span> kullanıcısını bir yerleşkenin yöneticisi
              yapmak üzeresiniz.
            </p>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke *</label>
              <select
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
                className={cn(FIELD_CLASSNAME, error && 'border-red-300')}
              >
                <option value="">Yerleşke seçin</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
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
              {isSubmitting ? 'Kaydediliyor...' : 'Yönetici Yap'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
