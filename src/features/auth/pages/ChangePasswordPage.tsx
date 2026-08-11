import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/shared/stores/authStore'
import * as authApi from '@/shared/api/endpoints/auth'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { getDefaultRouteForRoles } from '@/routes-config/permissions'

export function ChangePasswordPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const completePasswordChange = useAuthStore((state) => state.completePasswordChange)
  const logout = useAuthStore((state) => state.logout)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword
  const isValid = newPassword.length >= 6 && passwordsMatch

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      await authApi.changePassword({ newPassword })
      completePasswordChange()
      toast.success('Şifreniz güncellendi.')
      navigate(getDefaultRouteForRoles(user?.roles ?? []), { replace: true })
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Şifre güncellenemedi.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Yeni şifre belirleyin"
      description="İlk girişinizde güvenliğiniz için yeni bir şifre belirlemeniz gerekiyor."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-zinc-200">Yeni şifre</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="En az 6 karakter"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="rounded-none border-white/20 bg-black/30 text-white placeholder:text-zinc-400 focus-visible:ring-white/30"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-zinc-200">Yeni şifre (tekrar)</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
            className="rounded-none border-white/20 bg-black/30 text-white placeholder:text-zinc-400 focus-visible:ring-white/30"
            required
          />
          {confirmPassword.length > 0 && !passwordsMatch ? (
            <p className="text-xs text-red-400">Şifreler eşleşmiyor.</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full rounded-none" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Şifreyi kaydet
        </Button>
      </form>

      <button
        type="button"
        onClick={logout}
        className="mt-6 w-full text-center text-xs text-zinc-400 transition-colors hover:text-white"
      >
        Çıkış yap
      </button>
    </AuthLayout>
  )
}