import type { ReactNode } from 'react'
import { ChefHat } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
}
export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      />
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      <div className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium tracking-wide text-white drop-shadow-md md:left-10 md:top-10">
        <ChefHat className="size-5" />
        ChefPos
      </div>

      <div className="absolute bottom-6 left-6 text-xs text-white/80 drop-shadow-md md:bottom-10 md:left-10">
        © {new Date().getFullYear()} ChefPos
      </div>

      {/* Keskin köşeli (rounded-none), koyu transparan kart */}
      <div className="relative z-10 w-full max-w-md rounded-none border border-white/20 bg-black/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 space-y-1">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-zinc-300">{description}</p>
        </div>

        {children}
      </div>
    </div>
  )
}