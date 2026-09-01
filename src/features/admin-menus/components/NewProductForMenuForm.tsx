import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ImageUploadInput } from '@/shared/components/ImageUploadInput'
import { useCreateProductForMenu } from '@/features/admin-menus/hooks/useCreateProductForMenu'

const FIELD_CLASSNAME = 'h-9 w-full rounded-none border border-zinc-200 bg-white px-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface FormErrors {
  name?: string
  price?: string
}

function validate(name: string, price: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'Ürün adı zorunludur.'
  if (price.trim() === '' || Number(price) < 0) errors.price = 'Geçerli bir fiyat girin.'
  return errors
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) return error.response?.data?.detail ?? 'Bilgileri kontrol edip tekrar deneyin.'
    if (status === 401 || status === 403) return 'Bu işlem için yönetici yetkisine sahip olmalısınız.'
  }
  return 'Ürün oluşturulamadı. Lütfen tekrar deneyin.'
}

interface NewProductForMenuFormProps {
  menuId: string
}

export function NewProductForMenuForm({ menuId }: NewProductForMenuFormProps) {
  const createProductForMenu = useCreateProductForMenu()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined)

  function reset() {
    setName('')
    setPrice('')
    setDescription('')
    setImageFile(null)
    setErrors({})
    setSubmitError(null)
    setUploadProgress(undefined)
  }

  function handleSubmit() {
    const nextErrors = validate(name, price)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError(null)

    createProductForMenu.mutate(
      {
        menuId,
        name: name.trim(),
        price: Number(price),
        description: description.trim() || null,
        imageFile,
        onUploadProgress: setUploadProgress,
      },
      {
        onSuccess: () => {
          reset()
        },
        onError: (error) => {
          setSubmitError(getCreateErrorMessage(error))
        },
      },
    )
  }

  return (
    <div className="space-y-3 border border-zinc-200 p-3">
      {submitError && (
        <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{submitError}</div>
      )}

      <div>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ürün adı"
          disabled={createProductForMenu.isPending}
          className={cn(FIELD_CLASSNAME, errors.name && 'border-red-300')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="Satış fiyatı"
            disabled={createProductForMenu.isPending}
            className={cn(FIELD_CLASSNAME, errors.price && 'border-red-300')}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Açıklama (opsiyonel)"
          disabled={createProductForMenu.isPending}
          className={FIELD_CLASSNAME}
        />
      </div>

      <ImageUploadInput
        file={imageFile}
        onFileChange={setImageFile}
        disabled={createProductForMenu.isPending}
        uploading={createProductForMenu.isPending && uploadProgress !== undefined}
        uploadProgress={uploadProgress}
        size="sm"
      />

      <p className="text-xs text-zinc-400">
        Bu ürün doğrudan bu menü için, kategorisiz olarak oluşturulur. Reçete, ürün oluşturulduktan sonra aşağıdaki
        ürün listesinden eklenebilir.
      </p>

      <Button
        type="button"
        variant="outline"
        className="h-9 w-full rounded-none text-xs"
        onClick={handleSubmit}
        disabled={createProductForMenu.isPending}
      >
        {createProductForMenu.isPending ? 'Oluşturuluyor...' : 'Ürünü Oluştur ve Menüye Ekle'}
      </Button>
    </div>
  )
}
