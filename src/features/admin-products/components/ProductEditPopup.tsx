import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import type { CategoryAdminResponseDto } from '@/shared/types/category'
import type { ProductResponse } from '@/shared/types/product'
import {
  activateProduct,
  addProductLocation,
  deactivateProduct,
  removeProductLocation,
  updateProduct,
  updateProductPrice,
} from '@/shared/api/endpoints/products'
import { Skeleton } from '@/shared/components/Skeleton'
import { useProductDetail } from '@/features/admin-products/hooks/useProductDetail'
import { ProductImagePreview } from './ProductImagePreview'
import { ProductRecipeSection } from './ProductRecipeSection'

const FIELD_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const LOCATION_CHIP_CLASSNAME = 'border px-2.5 py-1 text-xs font-medium transition-colors'

function getDetailErrorMessage(): string {
  return 'Ürün bilgileri yüklenemedi.'
}

interface ProductEditFormProps {
  product: ProductResponse
  locations: LocationDto[]
  categories: CategoryAdminResponseDto[]
  onClose: () => void
}

function ProductEditForm({ product, locations, categories, onClose }: ProductEditFormProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? '')
  const [price, setPrice] = useState(String(product.price))
  const [locationIds, setLocationIds] = useState<string[]>(product.locationIds)
  const [isActive, setIsActive] = useState(product.isActive)
  const [saveErrors, setSaveErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false)

  const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? product.categoryId

  const hasChanges =
    name.trim() !== product.name ||
    description.trim() !== (product.description ?? '') ||
    imageUrl.trim() !== (product.imageUrl ?? '') ||
    Number(price) !== product.price ||
    isActive !== product.isActive ||
    locationIds.length !== product.locationIds.length ||
    locationIds.some((id) => !product.locationIds.includes(id))

  const isFormValid = name.trim() !== '' && Number(price) >= 0

  const isMultiLocationDeactivation = product.isActive && !isActive && locationIds.length > 1

  function setIsActiveAndResetConfirm(value: boolean) {
    setIsActive(value)
    setConfirmingDeactivate(false)
  }

  function toggleLocation(locationId: string) {
    setConfirmingDeactivate(false)
    setLocationIds((prev) => {
      if (prev.includes(locationId)) {
        if (prev.length <= 1) return prev
        return prev.filter((id) => id !== locationId)
      }
      return [...prev, locationId]
    })
  }

  async function persistChanges() {
    setIsSubmitting(true)
    setSaveErrors([])

    const errors: string[] = []

    const locationsToAdd = locationIds.filter((id) => !product.locationIds.includes(id))
    const locationsToRemove = product.locationIds.filter((id) => !locationIds.includes(id))
    let succeededLocationIds = product.locationIds

    for (const locationId of locationsToAdd) {
      try {
        await addProductLocation(product.id, locationId)
        succeededLocationIds = [...succeededLocationIds, locationId]
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi eklenemedi.`)
      }
    }

    for (const locationId of locationsToRemove) {
      try {
        await removeProductLocation(product.id, locationId)
        succeededLocationIds = succeededLocationIds.filter((id) => id !== locationId)
      } catch {
        const name = locations.find((location) => location.id === locationId)?.name ?? locationId
        errors.push(`${name} yerleşkesi kaldırılamadı.`)
      }
    }

    try {
      if (
        name.trim() !== product.name ||
        description.trim() !== (product.description ?? '') ||
        imageUrl.trim() !== (product.imageUrl ?? '')
      ) {
        await updateProduct(product.id, {
          name: name.trim(),
          description: description.trim() || null,
          imageUrl: imageUrl.trim() || null,
        })
      }
      if (Number(price) !== product.price) {
        await updateProductPrice(product.id, Number(price))
      }
      if (isActive !== product.isActive) {
        await (isActive ? activateProduct(product.id, succeededLocationIds[0]) : deactivateProduct(product.id, succeededLocationIds[0]))
      }
    } catch {
      errors.push('Ürün bilgileri güncellenemedi.')
    }

    setLocationIds(succeededLocationIds)
    setIsSubmitting(false)

    if (errors.length > 0) {
      setSaveErrors(errors)
      return
    }

    queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
    toast.success('Ürün bilgileri güncellendi.')
    onClose()
  }

  function handleSave() {
    if (!isFormValid) {
      setSaveErrors(['Lütfen tüm alanları geçerli değerlerle doldurun.'])
      return
    }

    if (isMultiLocationDeactivation && !confirmingDeactivate) {
      setConfirmingDeactivate(true)
      return
    }

    void persistChanges()
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Ürün Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4">
        {saveErrors.length > 0 && (
          <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {saveErrors.length === 1 ? (
              saveErrors[0]
            ) : (
              <>
                <p className="font-medium">Bazı değişiklikler kaydedilemedi:</p>
                <ul className="mt-1 list-inside list-disc">
                  {saveErrors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün Adı</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kategori</label>
            <input value={categoryName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Satış Fiyatı</label>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama</label>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görsel URL</label>
          <div className="flex items-center gap-2">
            <ProductImagePreview imageUrl={imageUrl.trim() || null} />
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşkeler</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => {
              const isAssigned = locationIds.includes(location.id)
              const isLastRemaining = isAssigned && locationIds.length <= 1
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => toggleLocation(location.id)}
                  disabled={isSubmitting || isLastRemaining}
                  title={isLastRemaining ? 'Bir ürünün en az bir yerleşkesi olmalıdır.' : undefined}
                  className={cn(
                    LOCATION_CHIP_CLASSNAME,
                    isAssigned
                      ? 'border-[#133458] bg-[#133458] text-white disabled:opacity-60'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                  )}
                >
                  {location.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActiveAndResetConfirm(true)}
              disabled={isSubmitting}
              className={cn(
                'flex-1 border-r border-zinc-200 py-2 text-xs font-medium transition-colors',
                isActive ? 'bg-[#84994F] text-white hover:bg-[#708243]' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setIsActiveAndResetConfirm(false)}
              disabled={isSubmitting}
              className={cn(
                'flex-1 py-2 text-xs font-medium transition-colors',
                !isActive ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Pasif
            </button>
          </div>
        </div>

        {confirmingDeactivate && (
          <div className="flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Bu ürün {locations.filter((location) => locationIds.includes(location.id)).map((location) => location.name).join(', ')}{' '}
              yerleşkelerinde kullanılıyor. Deaktive ederseniz <strong>hepsinde</strong> pasif hale gelecektir.
            </span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Reçete</label>
          <div className="space-y-2">
            {product.locations.map((locationRecipe) => (
              <ProductRecipeSection
                key={locationRecipe.locationId}
                productId={product.id}
                locationId={locationRecipe.locationId}
                locationName={locations.find((location) => location.id === locationRecipe.locationId)?.name ?? '—'}
                ingredients={locationRecipe.ingredients}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        {confirmingDeactivate ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-none text-sm"
              onClick={() => setConfirmingDeactivate(false)}
              disabled={isSubmitting}
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-destructive text-sm text-white hover:bg-destructive/90"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Evet, Deaktive Et'}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" className="h-11 flex-1 rounded-none text-sm" onClick={onClose}>
              İptal
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
              onClick={handleSave}
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </>
        )}
      </div>
    </>
  )
}

interface ProductEditPopupProps {
  productId: string | null
  locations: LocationDto[]
  categories: CategoryAdminResponseDto[]
  onClose: () => void
}

export function ProductEditPopup({ productId, locations, categories, onClose }: ProductEditPopupProps) {
  const { data: product, isLoading, isError } = useProductDetail(productId ?? undefined)

  return (
    <Dialog.Root open={Boolean(productId)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {isError ? (
            <div className="p-5">
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getDetailErrorMessage()}
              </div>
            </div>
          ) : isLoading || !product ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ProductEditForm key={product.id} product={product} locations={locations} categories={categories} onClose={onClose} />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
