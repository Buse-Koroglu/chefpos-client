import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UserResponseDto } from '@/shared/types/auth'
import { activateUser, deactivateUser } from '@/shared/api/endpoints/users'
import { updateUserInCache } from '@/features/admin-staff/utils'

export interface UpdateStaffMemberInput {
  userId: string
  isActive: boolean
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isActive }: UpdateStaffMemberInput): Promise<UserResponseDto> =>
      isActive ? activateUser(userId) : deactivateUser(userId),
    onSuccess: (user) => {
      updateUserInCache(queryClient, user)
      toast.success('Personel durumu güncellendi.')
    },
  })
}
