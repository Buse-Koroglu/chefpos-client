import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createProductForMenu } from '@/shared/api/endpoints/menus'
import { uploadProductImage } from '@/shared/api/endpoints/products'

interface CreateProductForMenuVariables {
  menuId: string
  name: string
  price: number
  description: string | null
  imageFile: File | null
  onUploadProgress?: (progress: number | undefined) => void
}

export function useCreateProductForMenu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({menuId, name, price, description,imageFile,onUploadProgress}: CreateProductForMenuVariables) => {
      const product = await createProductForMenu(menuId, { name, price, description })

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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'detail', variables.menuId] })
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      toast.success('Ürün oluşturuldu ve menüye eklendi.')
    },
  })
}
