import { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLocationStore } from '@/shared/stores/locationStore'
import { createStockRequest } from '@/shared/api/endpoints/stockRequests'
import { useIngredients } from '../hooks/useIngredients'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  ingredientId?: string
  requestedQuantity?: string
}

interface CreateStockRequestPopupProps {
  open: boolean
  onClose: () => void
}

function validate(
  ingredientId: string,
  requestedQuantity: string,
): FormErrors {
  const errors: FormErrors = {}

  if (!ingredientId) {
    errors.ingredientId = 'Ham madde seçmelisiniz.'
  }

  if (
    requestedQuantity.trim() === '' ||
    Number(requestedQuantity) <= 0
  ) {
    errors.requestedQuantity =
      'Geçerli bir talep miktarı girin.'
  }

  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 400) {
      return (
        error.response?.data?.detail ??
        'Stok talebi oluşturulamadı.'
      )
    }

    if (status === 401 || status === 403) {
      return 'Bu işlem için yetkiniz bulunmuyor.'
    }
  }

  return 'Stok talebi oluşturulamadı. Lütfen tekrar deneyin.'
}

export function CreateStockRequestPopup({
  open,
  onClose,
}: CreateStockRequestPopupProps) {
  const queryClient = useQueryClient()

  const locationId =
    useLocationStore(
      (state) => state.selectedLocationId,
    ) ?? undefined

  const {
    data: ingredients = [],
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useIngredients(locationId)

  const [ingredientId, setIngredientId] = useState('')
  const [requestedQuantity, setRequestedQuantity] =
    useState('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] =
    useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  function reset() {
    setIngredientId('')
    setRequestedQuantity('')
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(false)
  }

  function handleClose() {
    if (isSubmitting) {
      return
    }

    reset()
    onClose()
  }

  async function handleSubmit() {
    const nextErrors = validate(
      ingredientId,
      requestedQuantity,
    )

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (!locationId) {
      setSubmitError(
        'Aktif yerleşke bulunamadı. Lütfen bir yerleşke seçin.',
      )
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createStockRequest({
        ingredientId,
        requestedQuantity: Number(requestedQuantity),
      })

      await queryClient.invalidateQueries({
        queryKey: ['stock-requests'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['inventory-dashboard'],
      })

      toast.success(
        'Stok talebi başarıyla oluşturuldu.',
      )

      reset()
      onClose()
    } catch (error) {
      setSubmitError(
        getCreateErrorMessage(error),
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />

        <Dialog.Popup className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
              Yeni Stok Talebi
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
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {submitError}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Ham Madde
              </label>

              <select
                value={ingredientId}
                onChange={(event) => {
                  setIngredientId(event.target.value)

                  setErrors((previous) => ({
                    ...previous,
                    ingredientId: undefined,
                  }))
                }}
                disabled={
                  isIngredientsLoading ||
                  isIngredientsError ||
                  isSubmitting
                }
                className={cn(
                  FIELD_CLASSNAME,
                  errors.ingredientId &&
                    'border-red-300',
                )}
              >
                <option value="">
                  {isIngredientsLoading
                    ? 'Ham maddeler yükleniyor...'
                    : isIngredientsError
                      ? 'Ham maddeler yüklenemedi'
                      : 'Ham madde seçin'}
                </option>

                {ingredients.map((ingredient) => (
                  <option
                    key={ingredient.id}
                    value={ingredient.id}
                  >
                    {ingredient.name}
                  </option>
                ))}
              </select>

              {errors.ingredientId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.ingredientId}
                </p>
              )}

              {!isIngredientsLoading &&
                !isIngredientsError &&
                ingredients.length === 0 && (
                  <p className="mt-1.5 text-xs text-zinc-400">
                    Bu yerleşkede kullanılabilir ham madde
                    bulunamadı.
                  </p>
                )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Talep Miktarı
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={requestedQuantity}
                onChange={(event) => {
                  setRequestedQuantity(
                    event.target.value,
                  )

                  setErrors((previous) => ({
                    ...previous,
                    requestedQuantity: undefined,
                  }))
                }}
                placeholder="Örn. 10"
                disabled={isSubmitting}
                className={cn(
                  FIELD_CLASSNAME,
                  errors.requestedQuantity &&
                    'border-red-300',
                )}
              />

              {errors.requestedQuantity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.requestedQuantity}
                </p>
              )}
            </div>

            <div className="border border-zinc-200 bg-zinc-50 px-3 py-2.5">
              <p className="text-xs leading-5 text-zinc-500">
                Oluşturacağınız stok talebi aktif
                yerleşkeniz için oluşturulacaktır. Talep,
                ilgili yetkili tarafından onaylandıktan sonra
                işleme alınacaktır.
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
              disabled={
                isSubmitting ||
                isIngredientsLoading ||
                isIngredientsError ||
                ingredients.length === 0
              }
            >
              {isSubmitting
                ? 'Gönderiliyor...'
                : 'Stok Talebi Oluştur'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}