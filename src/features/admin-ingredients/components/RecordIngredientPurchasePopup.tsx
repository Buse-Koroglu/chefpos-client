import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { useRecordIngredientPurchase } from '@/features/admin-ingredients/hooks/useRecordIngredientPurchase'
import { FIELD_CLASSNAME } from './MultiSelectDropdown'

interface FormErrors {
  quantity?: string
  unitPrice?: string
}

interface RecordIngredientPurchasePopupProps {
  open: boolean
  ingredientId: string
  ingredientName: string
  onClose: () => void
}

function validate(quantity: string, unitPrice: string): FormErrors {
  const errors: FormErrors = {}
  if (quantity.trim() === '' || Number(quantity) <= 0) errors.quantity = 'Geçerli bir miktar girin.'
  if (unitPrice.trim() === '' || Number(unitPrice) < 0) errors.unitPrice = 'Geçerli bir birim fiyat girin.'
  return errors
}

export function RecordIngredientPurchasePopup({ open, ingredientId, ingredientName, onClose}: RecordIngredientPurchasePopupProps) {
  const recordPurchaseMutation = useRecordIngredientPurchase()

  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const isSubmitting = recordPurchaseMutation.isPending

  function reset() {
    setQuantity('')
    setUnitPrice('')
    setNote('')
    setErrors({})
    setSubmitError(null)
  }

  function handleClose() {
    if (isSubmitting) return
    reset()
    onClose()
  }

  function handleSubmit() {
    const nextErrors = validate(quantity, unitPrice)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError(null)

    recordPurchaseMutation.mutate(
      {
        ingredientId,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
        onError: (error) => {
          setSubmitError(getApiErrorMessage(error, 'Parti alışı kaydedilemedi. Lütfen tekrar deneyin.'))
        },
      },
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Parti Alışı Ekle
            </Dialog.Title>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-zinc-400 transition-colors hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            <p className="text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">{ingredientName}</span> için yeni bir alış partisi kaydedin.
              Bu işlem stoğu artırır ve ham maddenin son alış fiyatını günceller.
            </p>

            {submitError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Miktar</label>
                <input
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value)
                    setErrors((previous) => ({ ...previous, quantity: undefined }))
                  }}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  disabled={isSubmitting}
                  className={cn(FIELD_CLASSNAME, errors.quantity && 'border-red-300')}
                />
                {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Birim Fiyat</label>
                <input
                  value={unitPrice}
                  onChange={(event) => {
                    setUnitPrice(event.target.value)
                    setErrors((previous) => ({ ...previous, unitPrice: undefined }))
                  }}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className={cn(FIELD_CLASSNAME, errors.unitPrice && 'border-red-300')}
                />
                {errors.unitPrice && <p className="mt-1 text-xs text-red-600">{errors.unitPrice}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Not (opsiyonel)</label>
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Örn. Tedarikçi adı, fatura no..."
                disabled={isSubmitting}
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
              {isSubmitting ? 'Kaydediliyor...' : 'Parti Alışını Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
