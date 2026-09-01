import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {activateProduct,addProductLocation,deactivateProduct,deleteProductImage,removeProductLocation,updateProduct,updateProductPrice,uploadProductImage,} from '@/shared/api/endpoints/products'
import type { LocationDto } from '@/shared/types/location'
import type { ProductResponse } from '@/shared/types/product'

interface UpdateProductVariables {
  product: ProductResponse
  locations: LocationDto[]
  name: string
  description: string
  price: string
  imageFile: File | null
  removeExistingImage: boolean
  isActive: boolean
  locationIds: string[]
  onUploadProgress: (percent: number | undefined) => void
}

interface UpdateProductResult {
  errors: string[]
  succeededLocationIds: string[]
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({product,locations,name,description,price,imageFile,removeExistingImage,isActive,locationIds,onUploadProgress}: UpdateProductVariables): Promise<UpdateProductResult> => {
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
        if (name.trim() !== product.name || description.trim() !== (product.description ?? '')) {
          await updateProduct(product.id, {
            name: name.trim(),
            description: description.trim() || null,
          })
        }
        if (imageFile) {
          onUploadProgress(0)
          await uploadProductImage(product.id, imageFile, onUploadProgress)
        } else if (removeExistingImage) {
          await deleteProductImage(product.id)
        }
        if (Number(price) !== product.price) {
          await updateProductPrice(product.id, Number(price))
        }
        if (isActive !== product.isActive) {
          await (isActive
            ? activateProduct(product.id, succeededLocationIds[0])
            : deactivateProduct(product.id, succeededLocationIds[0]))
        }
      } catch {
        errors.push('Ürün bilgileri güncellenemedi.')
      }

      return { errors, succeededLocationIds }
    },
    onSuccess: (result) => {
      if (result.errors.length > 0) return
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
      toast.success('Ürün bilgileri güncellendi.')
    },
  })
}
