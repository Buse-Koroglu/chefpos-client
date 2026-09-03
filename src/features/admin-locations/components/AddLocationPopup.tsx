import { useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useActiveUsers } from '@/features/admin-locations/hooks/useActiveUsers'
import { useCreateLocation } from '@/features/admin-locations/hooks/useCreateLocation'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 409) return 'Bu isimde bir yerleşke zaten kayıtlı.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Yerleşke oluşturulamadı. Lütfen tekrar deneyin.'
}

interface AddLocationPopupProps {
  open: boolean
  onClose: () => void
}

export function AddLocationPopup({ open, onClose }: AddLocationPopupProps) {
  const { data: usersResult, isLoading: isUsersLoading } = useActiveUsers()
  const createLocationMutation = useCreateLocation()
  const users = usersResult?.items ?? []

  const [name, setName] = useState('')
  const [adminUserId, setAdminUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setName('')
    setAdminUserId('')
    setError(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Yerleşke adı zorunludur.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createLocationMutation.mutateAsync({ name: name.trim(), adminUserId: adminUserId || undefined })
      handleClose()
    } catch (err) {
      setError(getCreateErrorMessage(err))
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yeni Yerleşke Ekle
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-4">
            {error && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke Adı *</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Merkez Şube"
                className={cn(FIELD_CLASSNAME, error && 'border-red-300')}
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Bu Yerleşkenin Yöneticisi</label>
              <select
                value={adminUserId}
                onChange={(event) => setAdminUserId(event.target.value)}
                disabled={isUsersLoading}
                className={FIELD_CLASSNAME}
              >
                <option value="">Daha sonra ata</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-zinc-400">
                Seçilen kullanıcıya bu yerleşke için Yönetici rolü ve erişimi atanır.
              </p>
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
