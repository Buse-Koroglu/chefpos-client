import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useIngredients } from '@/features/inventory-dashboard/hooks/useIngredients'
import { useManualStockDeduction } from '../hooks/useManualStockDeduction'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const TEXTAREA_CLASSNAME = 'w-full rounded-none border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  ingredientId?: string
  quantity?: string
  note?: string
}

interface ManualDeductionPopupProps {
  open: boolean
  onClose: () => void
}

function validate(ingredientId: string, quantity: string, note: string): FormErrors {
  const errors: FormErrors = {}
  if (!ingredientId) errors.ingredientId = 'Ham madde seçmelisiniz.'
  if (quantity.trim() === '' || Number(quantity) <= 0) errors.quantity = 'Geçerli bir miktar girin.'
  if (note.trim() === '') errors.note = 'Elden düşme için bir açıklama/gerekçe girilmelidir.'
  return errors
}

export function ManualDeductionPopup({ open, onClose }: ManualDeductionPopupProps) {
  const manualStockDeductionMutation = useManualStockDeduction()

  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined

  const {data: ingredients = [], isLoading: isIngredientsLoading, isError: isIngredientsError} = useIngredients(locationId)

  const [ingredientId, setIngredientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setIngredientId('')
    setQuantity('')
    setNote('')
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    if (isSubmitting) return
    reset()
    onClose()
  }

  async function handleSubmit() {
    const nextErrors = validate(ingredientId, quantity, note)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)

    manualStockDeductionMutation.mutate(
      { ingredientId, quantity: Number(quantity), note: note.trim() },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
        onError: (error) => {
          setSubmitError(getApiErrorMessage(error, 'Elden düşüm kaydedilemedi. Lütfen tekrar deneyin.'))
          setIsSubmitting(false)
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
              Elden Düşüm
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
            {submitError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ham Madde</label>
              <select
                value={ingredientId}
                onChange={(event) => {
                  setIngredientId(event.target.value)
                  setErrors((previous) => ({ ...previous, ingredientId: undefined }))
                }}
                disabled={isIngredientsLoading || isIngredientsError || isSubmitting}
                className={cn(FIELD_CLASSNAME, errors.ingredientId && 'border-red-300')}
              >
                <option value="">
                  {isIngredientsLoading
                    ? 'Ham maddeler yükleniyor...'
                    : isIngredientsError
                      ? 'Ham maddeler yüklenemedi'
                      : 'Ham madde seçin'}
                </option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
              {errors.ingredientId && <p className="mt-1 text-xs text-red-600">{errors.ingredientId}</p>}
            </div>

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
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama / Gerekçe</label>
              <textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value)
                  setErrors((previous) => ({ ...previous, note: undefined }))
                }}
                rows={3}
                placeholder="Örn. Fire, zayiat, son kullanma tarihi geçti..."
                disabled={isSubmitting}
                className={cn(TEXTAREA_CLASSNAME, errors.note && 'border-red-300')}
              />
              {errors.note && <p className="mt-1 text-xs text-red-600">{errors.note}</p>}
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
              className="h-11 flex-1 rounded-none bg-destructive text-sm text-white hover:bg-destructive/90"
              onClick={handleSubmit}
              disabled={isSubmitting || isIngredientsLoading || isIngredientsError}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Elden Düşümü Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
