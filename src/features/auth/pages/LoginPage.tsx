import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/shared/stores/authStore'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { getDefaultRouteForRoles } from '@/routes-config/permissions'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [personalId, setPersonalId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = /^\d{11}$/.test(personalId) && password.length > 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      const user = await login(personalId, password)
      if (user.isFirstLogin) {
        navigate('/app/change-password', { replace: true })
      } else {
        navigate(getDefaultRouteForRoles(user.roles), { replace: true })
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Giriş yapılamadı. Bilgilerinizi kontrol edin.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Giriş yap" description="Devam etmek için personel bilgilerinizi girin.">
      <form className="space-y-4" onSubmit={handleSubmit}>
  <div className="space-y-1.5">
    <Label htmlFor="personalId" className="text-zinc-200">Personel No</Label>
    <Input
      id="personalId"
      name="personalId"
      inputMode="numeric"
      autoComplete="username"
      maxLength={11}
      placeholder="11 haneli personel numaranız"
      value={personalId}
      onChange={(event) => setPersonalId(event.target.value.replace(/\D/g, ''))}
      className="rounded-none border-white/20 bg-black/30 text-white placeholder:text-zinc-400 focus-visible:ring-white/30"
      required
    />
  </div>

  <div className="space-y-1.5">
    <Label htmlFor="password" className="text-zinc-200">Şifre</Label>
    <div className="relative">
      <Input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Şifreniz"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="rounded-none border-white/20 bg-black/30 text-white pr-9 placeholder:text-zinc-400 focus-visible:ring-white/30"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        className="absolute inset-y-0 right-1 my-auto flex h-7 w-7 items-center justify-center rounded-none bg-black/40 text-white/70 transition-colors hover:bg-black/60 hover:text-white"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  </div>

  <Button type="submit" className="w-full rounded-none" disabled={!isValid || isSubmitting}>
    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
    Giriş yap
  </Button>
</form>
    </AuthLayout>
  )
}
