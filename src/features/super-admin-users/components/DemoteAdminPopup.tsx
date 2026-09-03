import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { useDemoteAdmin } from '@/features/super-admin-users/hooks/useDemoteAdmin'

interface DemoteAdminPopupProps {
  userId: string | null
  userName: string
  locationIds: string[]
  locationsById: Map<string, string>
  onClose: () => void
}

export function DemoteAdminPopup({ userId, userName, locationIds, locationsById, onClose }: DemoteAdminPopupProps) {
  const demoteMutation = useDemoteAdmin()
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = demoteMutation.isPending

  function handleClose() {
    setError(null)
    onClose()
  }

  function handleSubmit() {
    if (!userId) return
    setError(null)

    demoteMutation.mutate(
      { userId, locationIds },
      {
        onSuccess: () => handleClose(),
        onError: (err) => setError(getApiErrorMessage(err, 'Kullanıcı yöneticilikten çıkarılamadı.')),
      },
    )
  }

  return (
    <Dialog.Root open={Boolean(userId)} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yöneticilikten Çıkar
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-4">
            {error && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

            <p className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-900">{userName}</span> kullanıcısının yöneticilik rolünü
              kaldırmak üzeresiniz.
            </p>

            {locationIds.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                  Erişimi de kaldırılacak yerleşkeler
                </label>
                <p className="text-sm text-zinc-600">
                  {locationIds.map((id) => locationsById.get(id) ?? id).join(', ')}
                </p>
              </div>
            )}
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
              className="h-11 flex-1 rounded-none bg-red-600 text-sm text-white hover:bg-red-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'İşleniyor...' : 'Yöneticilikten Çıkar'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
