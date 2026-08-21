import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { recordProductProduction } from '@/shared/api/endpoints/ingredients'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useProducts } from '../hooks/useProducts'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  productId?: string
  quantity?: string
}

interface RecordProductionPopupProps {
  open: boolean
  onClose: () => void
}

function validate(productId: string, quantity: string): FormErrors {
  const errors: FormErrors = {}
  if (!productId) errors.productId = 'Ürün seçmelisiniz.'
  if (quantity.trim() === '' || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    errors.quantity = 'Geçerli bir tam sayı miktar girin.'
  }
  return errors
}

export function RecordProductionPopup({ open, onClose }: RecordProductionPopupProps) {
  const queryClient = useQueryClient()

  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined

  const { data: products = [], isLoading: isProductsLoading, isError: isProductsError } = useProducts(locationId)

  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProduct = useMemo(() => products.find((product) => product.id === productId), [products, productId])
  const hasRecipeAtLocation =
    !selectedProduct || (selectedProduct.locations.find((location) => location.locationId === locationId)?.ingredients.length ?? 0) > 0

  function reset() {
    setProductId('')
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
    const nextErrors = validate(productId, quantity)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (!locationId) {
      setSubmitError('Aktif yerleşke bulunamadı. Lütfen bir yerleşke seçin.')
      return
    }

    if (!hasRecipeAtLocation) {
      setSubmitError('Bu ürünün bu yerleşkede tanımlı bir reçetesi (ham madde listesi) yok.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await recordProductProduction({
        productId,
        locationId,
        quantity: Number(quantity),
        note: note.trim() || undefined,
      })

      await queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      await queryClient.invalidateQueries({ queryKey: ['stockMovements'] })

      toast.success('Üretim başarıyla kaydedildi.')
      reset()
      onClose()
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Üretim kaydedilemedi. Lütfen tekrar deneyin.'))
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
              Üretim Kaydet
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
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün</label>
              <select
                value={productId}
                onChange={(event) => {
                  setProductId(event.target.value)
                  setErrors((previous) => ({ ...previous, productId: undefined }))
                }}
                disabled={isProductsLoading || isProductsError || isSubmitting}
                className={cn(FIELD_CLASSNAME, errors.productId && 'border-red-300')}
              >
                <option value="">
                  {isProductsLoading ? 'Ürünler yükleniyor...' : isProductsError ? 'Ürünler yüklenemedi' : 'Ürün seçin'}
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && <p className="mt-1 text-xs text-red-600">{errors.productId}</p>}
              {selectedProduct && !hasRecipeAtLocation && (
                <p className="mt-1.5 text-xs text-red-600">Bu ürünün bu yerleşkede tanımlı bir reçetesi yok.</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Üretilen Adet</label>
              <input
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value)
                  setErrors((previous) => ({ ...previous, quantity: undefined }))
                }}
                type="number"
                min="1"
                step="1"
                placeholder="Örn. 5"
                disabled={isSubmitting}
                className={cn(FIELD_CLASSNAME, errors.quantity && 'border-red-300')}
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Not (opsiyonel)</label>
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Boş bırakılırsa otomatik oluşturulur"
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
              disabled={isSubmitting || isProductsLoading || isProductsError}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Üretimi Kaydet'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
