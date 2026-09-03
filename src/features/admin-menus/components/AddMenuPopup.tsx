import { useState } from 'react'
import axios from 'axios'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCreateMenu } from '@/features/admin-menus/hooks/useCreateMenu'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  name?: string
}

function validate(name: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'Menü adı zorunludur.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) return error.response?.data?.detail ?? 'Bilgileri kontrol edip tekrar deneyin.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Menü oluşturulamadı. Lütfen tekrar deneyin.'
}

interface AddMenuPopupProps {
  open: boolean
  locationId: string | undefined
  onClose: () => void
}

export function AddMenuPopup({ open, locationId, onClose }: AddMenuPopupProps) {
  const createMenu = useCreateMenu()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  function reset() {
    setName('')
    setDescription('')
    setErrors({})
    setSubmitError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit() {
    const nextErrors = validate(name)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !locationId) return

    setSubmitError(null)

    createMenu.mutate(
      { name: name.trim(), description: description.trim() || null, locationId },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: (error) => {
          setSubmitError(getCreateErrorMessage(error))
        },
      },
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Yeni Menü Ekle
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
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Menü Adı</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. 30 Ağustos Menüsü"
                className={cn(FIELD_CLASSNAME, errors.name && 'border-red-300')}
                autoFocus
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama (opsiyonel)</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Menü açıklaması"
                className={FIELD_CLASSNAME}
              />
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-200 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-none text-sm"
              onClick={handleClose}
              disabled={createMenu.isPending}
            >
              İptal
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
              onClick={handleSubmit}
              disabled={createMenu.isPending}
            >
              {createMenu.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
