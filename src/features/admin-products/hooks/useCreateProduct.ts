import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createProduct, uploadProductImage } from '@/shared/api/endpoints/products'
import type { CreateProductRequest } from '@/shared/types/product'

interface CreateProductVariables extends CreateProductRequest {
  imageFile: File | null
  onUploadProgress?: (percent: number) => void
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ imageFile, onUploadProgress, ...payload }: CreateProductVariables) => {
      const product = await createProduct(payload)

      if (imageFile) {
        try {
          onUploadProgress?.(0)
          await uploadProductImage(product.id, imageFile, onUploadProgress)
        } catch {
          toast.error('Ürün oluşturuldu ancak görsel yüklenemedi. Düzenleme ekranından tekrar deneyebilirsiniz.')
        }
      }

      return product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false })
      toast.success('Ürün başarıyla eklendi.')
    },
  })
}
