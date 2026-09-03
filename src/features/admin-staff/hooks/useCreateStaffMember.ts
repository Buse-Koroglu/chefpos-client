import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Role, UserResponseDto } from '@/shared/types/auth'
import { createUser, grantRoleAtLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { addUserToCache, findStockManagerConflictMessage, isStockManagerConflict, StockManagerPrecheckError } from '@/features/admin-staff/utils'
import { ROLE_LABELS } from '@/features/admin-staff/constants'

export interface CreateStaffMemberInput {
  firstName: string
  lastName: string
  personalId: string
  roles: Role[]
  locationId: string
  locationsById: Map<string, string>
}

export interface CreateStaffMemberResult {
  user: UserResponseDto
  generatedPassword: string | null
  failedRoles: Role[]
  stockManagerConflictMessage: string | null
}

export function useCreateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateStaffMemberInput): Promise<CreateStaffMemberResult> => {
      if (input.roles.includes('STOCK_MANAGER')) {
        const conflict = await findStockManagerConflictMessage([input.locationId], input.locationsById)
        if (conflict) {
          throw new StockManagerPrecheckError(
            `${conflict} Personeli oluşturmadan önce ilgili kullanıcının rolünü değiştirin veya farklı bir yerleşke seçin.`,
          )
        }
      }

      const { user, generatedPassword } = await createUser({ personalId: input.personalId, firstName: input.firstName, lastName: input.lastName, roles: input.roles })

      let finalUser = user
      const failedRoles: Role[] = []
      let stockManagerConflictMessage: string | null = null

      for (const role of input.roles) {
        try {
          finalUser = await grantRoleAtLocation(finalUser.id, role, input.locationId)
        } catch (error) {
          failedRoles.push(role)
          if (isStockManagerConflict(error)) {
            stockManagerConflictMessage = getApiErrorMessage(error)
          }
        }
      }

      return { user: finalUser, generatedPassword, failedRoles, stockManagerConflictMessage }
    },
    onSuccess: (result) => {
      addUserToCache(queryClient, result.user)
      if (result.failedRoles.length > 0) {
        const failedNames = result.failedRoles.map((role) => ROLE_LABELS[role]).join(', ')
        toast.warning(`${result.user.firstName} ${result.user.lastName} oluşturuldu ancak ${failedNames} rolü atanamadı.`)
      } else {
        toast.success('Personel başarıyla eklendi.')
      }
    },
  })
}
