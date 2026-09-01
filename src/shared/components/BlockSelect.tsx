import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface BlockSelectOption {
  value: string
  label: string
}

interface BlockSelectProps {
  options: BlockSelectOption[]
  value: string | null | undefined
  onChange: (value: string) => void
  icon?: ReactNode
  placeholder?: string
  direction?: 'up' | 'down'
}

// Sidebar / drawer'larda kullanılan, native select yerine tall list item'lı ortak block-style dropdown

export function BlockSelect({ options, value, onChange, icon, placeholder = 'Seçiniz', direction = 'down' }: BlockSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)
  const disabled = options.length === 0

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
        disabled={disabled}
        className="flex w-full items-center gap-2 border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-600 disabled:text-zinc-400"
      >
        {icon}
        <span className="flex-1 truncate text-left">{selected ? selected.label : placeholder}</span>
        {!disabled && <ChevronDown className="size-4 shrink-0 text-zinc-400" />}
      </button>

      {open && (
        <div
          className={`absolute inset-x-0 z-50 max-h-72 overflow-y-auto border border-zinc-200 bg-white shadow-lg ${
            direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`flex w-full items-center px-3 py-3.5 text-left text-base ${
                option.value === value ? 'bg-[#133458] text-white' : 'text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
