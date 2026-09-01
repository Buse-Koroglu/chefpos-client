import { LogOut } from 'lucide-react'
import type { UserResponseDto } from '@/shared/types/auth'

interface HeaderProps {
  user: UserResponseDto | null
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3 text-sm">
        <span>
          {user?.firstName} {user?.lastName}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" />
          Çıkış
        </button>
      </div>
    </header>
  )
}