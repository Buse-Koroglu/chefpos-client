import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import { activateUser, addRole, deactivateUser, removeRole } from '@/shared/api/endpoints/users'
import { ROLE_LABELS } from '@/features/admin-staff/constants'
import { findStockManagerConflictMessage, StockManagerPrecheckError, updateUserInCache } from '@/features/admin-staff/utils'

export interface UpdateStaffMemberInput {
  baseline: UserResponseDto
  roles: Role[]
  locationIds: string[]
  isActive: boolean
  locationsById: Map<string, string>
}

export interface UpdateStaffMemberResult {
  user: UserResponseDto
  errors: string[]
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateStaffMemberInput): Promise<UpdateStaffMemberResult> => {
      const { baseline, roles, locationIds, isActive } = input

      if (roles.includes('STOCK_MANAGER')) {
        const conflict = await findStockManagerConflictMessage(locationIds, input.locationsById, baseline.id)
        if (conflict) {
          throw new StockManagerPrecheckError(
            `${conflict} Değişiklikleri kaydetmeden önce ilgili kullanıcının rolünü değiştirin veya farklı bir yerleşke seçin.`,
          )
        }
      }

      const rolesToAdd = roles.filter((role) => !baseline.roles.includes(role))
      const rolesToRemove = baseline.roles.filter((role) => !roles.includes(role))

      let current = baseline
      const errors: string[] = []

      for (const role of rolesToAdd) {
        try {
          current = await addRole(current.id, role)
        } catch {
          errors.push(`${ROLE_LABELS[role]} rolü eklenemedi.`)
        }
      }

      for (const role of rolesToRemove) {
        try {
          current = await removeRole(current.id, role)
        } catch {
          errors.push(`${ROLE_LABELS[role]} rolü kaldırılamadı.`)
        }
      }

      if (isActive !== baseline.isActive) {
        try {
          current = isActive ? await activateUser(current.id) : await deactivateUser(current.id)
        } catch {
          errors.push('Durum güncellenemedi.')
        }
      }

      return { user: current, errors }
    },
    onSuccess: (result) => {
      updateUserInCache(queryClient, result.user)
      if (result.errors.length === 0) {
        toast.success('Personel bilgileri güncellendi.')
      }
    },
  })
}
