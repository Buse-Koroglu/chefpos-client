import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TouchSelectOption {
  value: string
  label: string
}

interface TouchSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: TouchSelectOption[]
  placeholder: string
}

// native select yerine parmakla seçimi kolaylaştırmak için büyük dokunma alanlı özel dropdown
export function TouchSelect({ id, value, onChange, options, placeholder }: TouchSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = options.find((option) => option.value === value)?.label ?? placeholder

  function handleSelect(nextValue: string) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 w-full items-center justify-between border border-zinc-200 bg-white px-3 text-lg text-zinc-900 outline-none focus-visible:border-zinc-400"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={cn('size-5 shrink-0 text-zinc-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto border border-zinc-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => handleSelect('')}
            className={cn(
              'flex w-full items-center px-4 py-3.5 text-left text-lg',
              value === '' ? 'bg-blue-50 font-medium text-blue-700' : 'text-zinc-700 hover:bg-zinc-100',
            )}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex w-full items-center px-4 py-3.5 text-left text-lg',
                value === option.value ? 'bg-blue-50 font-medium text-blue-700' : 'text-zinc-700 hover:bg-zinc-100',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
