import { Search, X } from 'lucide-react'

const SEARCH_INPUT_CLASSNAME =
  'h-10 w-full max-w-sm rounded-none border border-zinc-200 bg-zinc-50 pl-9 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={SEARCH_INPUT_CLASSNAME}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Aramayı temizle"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
