import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { activateUser, deactivateUser } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

interface UpdateUserStatusVariables {
  userId: string
  nextActive: boolean
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, nextActive }: UpdateUserStatusVariables) =>
      nextActive ? activateUser(userId) : deactivateUser(userId),
    onSuccess: (_data, { nextActive }) => {
      queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
      toast.success(nextActive ? 'Kullanıcı aktif hale getirildi.' : 'Kullanıcı pasif hale getirildi.')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Durum güncellenemedi.'))
    },
  })
}
