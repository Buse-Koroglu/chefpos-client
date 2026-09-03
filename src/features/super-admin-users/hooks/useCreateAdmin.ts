import { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UserResponseDto } from '@/shared/types/auth'
import { createUser, getAdminByLocation, grantRoleAtLocation } from '@/shared/api/endpoints/users'
import { getApiErrorMessage } from '@/shared/api/apiError'

export interface CreateAdminFormData {
  firstName: string
  lastName: string
  personalId: string
  locationId: string
}

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 409) return 'Bu personel numarası zaten kayıtlı.'
    if (status === 401 || status === 403) return 'Bu işlem için süper yönetici yetkisine sahip olmalısınız.'
  }
  return 'Yönetici oluşturulamadı. Lütfen tekrar deneyin.'
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()

  const [step, setStep] = useState<'form' | 'result'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdUser, setCreatedUser] = useState<UserResponseDto | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [pendingLocationId, setPendingLocationId] = useState<string | null>(null)
  const [locationAssigned, setLocationAssigned] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  function invalidateUsers() {
    queryClient.invalidateQueries({ queryKey: ['users'], exact: false })
  }

  function reset() {
    setStep('form')
    setIsSubmitting(false)
    setSubmitError(null)
    setCreatedUser(null)
    setGeneratedPassword(null)
    setPendingLocationId(null)
    setLocationAssigned(true)
    setIsRetrying(false)
  }

  async function submit(data: CreateAdminFormData) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const existingAdmin = await getAdminByLocation(data.locationId)
      if (existingAdmin) {
        setSubmitError(
          `Bu yerleşkede zaten bir Yönetici atanmış: ${existingAdmin.firstName} ${existingAdmin.lastName}.`,
        )
        setIsSubmitting(false)
        return
      }

      const { user, generatedPassword: password } = await createUser({
        personalId: data.personalId,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: ['ADMIN'],
      })

      let finalUser = user
      let assigned = true
      try {
        finalUser = await grantRoleAtLocation(user.id, 'ADMIN', data.locationId)
      } catch {
        assigned = false
      }

      invalidateUsers()
      setCreatedUser(finalUser)
      setGeneratedPassword(password)
      setPendingLocationId(data.locationId)
      setLocationAssigned(assigned)
      setStep('result')

      if (assigned) {
        toast.success('Yönetici başarıyla oluşturuldu.')
      } else {
        toast.warning(`${finalUser.firstName} ${finalUser.lastName} oluşturuldu ancak yerleşke ataması başarısız oldu.`)
      }
    } catch (error) {
      setSubmitError(getCreateErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function retryLocation() {
    if (!createdUser || !pendingLocationId) return
    setIsRetrying(true)
    try {
      const updatedUser = await grantRoleAtLocation(createdUser.id, 'ADMIN', pendingLocationId)
      setCreatedUser(updatedUser)
      setLocationAssigned(true)
      invalidateUsers()
      toast.success('Yerleşke ataması tamamlandı.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Yerleşke ataması yine başarısız oldu.'))
    } finally {
      setIsRetrying(false)
    }
  }

  return {
    step,
    isSubmitting,
    submitError,
    createdUser,
    generatedPassword,
    locationAssigned,
    isRetrying,
    submit,
    retryLocation,
    reset,
  }
}
