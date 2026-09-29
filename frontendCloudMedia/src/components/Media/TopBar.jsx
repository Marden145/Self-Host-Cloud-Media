import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Logo } from './Sidebar'

export function TopBar({ onAddMedia }) {
  const inputRef = useRef(null)

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
        <div className="lg:hidden">
          <Logo />
        </div>
        <h1 className="ml-auto text-lg font-semibold tracking-tight lg:ml-0">Biblioteca</h1>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) onAddMedia(e.target.files)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:px-4"
        >
          <Upload className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Subir</span>
        </button>

        <button
          type="button"
          aria-label="Tu cuenta"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-highlight-foreground"
        >
          MR
        </button>
      </div>
    </header>
  )
}