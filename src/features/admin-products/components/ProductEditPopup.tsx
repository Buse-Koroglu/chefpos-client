import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LocationDto } from '@/shared/types/location'
import type { CategoryAdminResponseDto } from '@/shared/types/category'
import type { ProductResponse } from '@/shared/types/product'
import { Skeleton } from '@/shared/components/Skeleton'
import { ImageUploadInput } from '@/shared/components/ImageUploadInput'
import { useProductDetail } from '@/features/admin-products/hooks/useProductDetail'
import { useUpdateProduct } from '@/features/admin-products/hooks/useUpdateProduct'
import { ProductRecipeSection } from './ProductRecipeSection'
import { FIELD_CLASSNAME, MultiSelectDropdown } from './MultiSelectDropdown'

function getDetailErrorMessage(): string {
  return 'Ürün bilgileri yüklenemedi.'
}

interface ProductEditFormProps {
  product: ProductResponse
  locations: LocationDto[]
  categories: CategoryAdminResponseDto[]
  canEditLocations: boolean
  onClose: () => void
}

function ProductEditForm({ product, locations, categories, canEditLocations, onClose }: ProductEditFormProps) {
  const updateProductMutation = useUpdateProduct()

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined)
  const [price, setPrice] = useState(String(product.price))
  const [locationIds, setLocationIds] = useState<string[]>(product.locationIds)
  const [isActive, setIsActive] = useState(product.isActive)
  const [saveErrors, setSaveErrors] = useState<string[]>([])
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false)
  const isSubmitting = updateProductMutation.isPending

  const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? product.categoryId ?? '—'

  const hasChanges =
    name.trim() !== product.name ||
    description.trim() !== (product.description ?? '') ||
    imageFile !== null ||
    removeExistingImage ||
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
    setSaveErrors([])
    setUploadProgress(undefined)

    const result = await updateProductMutation.mutateAsync({
      product,
      locations,
      name,
      description,
      price,
      imageFile,
      removeExistingImage,
      isActive,
      locationIds,
      onUploadProgress: setUploadProgress,
    })

    setLocationIds(result.succeededLocationIds)

    if (result.errors.length > 0) {
      setSaveErrors(result.errors)
      return
    }

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

  const locationOptions = locations.map((loc) => ({ id: loc.id, label: loc.name }))

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
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Görsel</label>
          <ImageUploadInput
            file={imageFile}
            onFileChange={(nextFile) => {
              setImageFile(nextFile)
              if (nextFile) setRemoveExistingImage(false)
            }}
            existingImageUrl={removeExistingImage ? null : product.imageUrl}
            onRemoveExisting={() => setRemoveExistingImage(true)}
            disabled={isSubmitting}
            uploading={isSubmitting && uploadProgress !== undefined}
            uploadProgress={uploadProgress}
          />
        </div>

        {canEditLocations ? (
          <MultiSelectDropdown
            label="Yerleşkeler"
            placeholder="Yerleşke seçiniz..."
            options={locationOptions}
            selectedIds={locationIds}
            onToggle={toggleLocation}
            disabled={isSubmitting}
            minRequired={1}
          />
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
            <input
              value={
                locations
                  .filter((location) => locationIds.includes(location.id))
                  .map((location) => location.name)
                  .join(', ') || '—'
              }
              readOnly
              className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
            />
          </div>
        )}

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
  canEditLocations?: boolean
  onClose: () => void
}

export function ProductEditPopup({ productId, locations, categories, canEditLocations = false, onClose }: ProductEditPopupProps) {
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
            <ProductEditForm
              key={product.id}
              product={product}
              locations={locations}
              categories={categories}
              canEditLocations={canEditLocations}
              onClose={onClose}
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}