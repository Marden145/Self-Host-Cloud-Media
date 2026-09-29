import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
export function Lightbox({ items, index, onIndexChange, onClose }) {
  const item = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onIndexChange(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onIndexChange(index + 1)
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [index, hasPrev, hasNext, onClose, onIndexChange])

  if (!item) return null
  const isVideo = item.type === 1
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground text-background">
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-full hover:bg-background/10">
          <X className="size-5" />
        </button>
        <p className="truncate text-sm font-medium">{item.originalFileName}</p>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        {isVideo ? (
          <video key={item.id} src={getMediaUrl(item.storagePath)} controls autoPlay playsInline className="max-h-full max-w-full rounded-lg" />
        ) : (
          <img src={getMediaUrl(item.storagePath)} alt={item.originalFileName} className="max-h-full max-w-full rounded-lg object-contain" />
        )}

        {hasPrev && (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 sm:left-4"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 sm:right-4"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}