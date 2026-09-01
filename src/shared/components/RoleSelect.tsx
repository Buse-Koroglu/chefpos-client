import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ROLE_LABELS } from '@/shared/types/auth'
import type { Role } from '@/shared/types/auth'

interface RoleSelectProps {
  roles: Role[]
  currentRole: Role | undefined
  onSelect: (role: Role) => void
}

// Sidebar user card içindeki görev seçimi (native select yerine tall list item'lı custom dropdown)

export function RoleSelect({ roles, currentRole, onSelect }: RoleSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1 text-base text-zinc-500"
      >
        <span>{currentRole ? ROLE_LABELS[currentRole] : ''}</span>
        <ChevronDown className="size-4 shrink-0 text-zinc-400" />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full z-50 mb-1 max-h-72 min-w-32 overflow-y-auto border border-zinc-200 bg-white shadow-lg">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onSelect(role)
                setOpen(false)
              }}
              className={`flex w-full items-center whitespace-nowrap px-3 py-3.5 text-left text-base ${
                role === currentRole ? 'bg-[#133458] text-white' : 'text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
