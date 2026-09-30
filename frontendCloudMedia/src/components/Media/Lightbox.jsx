import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { cn } from '../../utils/utils'

export function Lightbox({ items, index, onIndexChange, onClose, onNeedMore, hasMorePages, onToggleFavorite }) {
  const item = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  useEffect(() => {
    if (hasMorePages && index >= items.length - 3) onNeedMore()
  }, [index, items.length, hasMorePages, onNeedMore])

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
  const src = getMediaUrl(item.storagePath)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-foreground text-background"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-background/10">
          <X className="size-5" />
        </button>
        <p className="truncate text-sm font-medium">{item.originalFileName}</p>

        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          aria-label={item.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          aria-pressed={item.isFavorite}
          className="ml-auto flex size-10 items-center justify-center rounded-full transition-colors hover:bg-background/10"
        >
          <Heart className={cn('size-5', item.isFavorite && 'fill-rose-500 text-rose-500')} aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        <AnimatePresence mode="wait">
          {isVideo ? (
            <video key={item.id} src={src} controls autoPlay playsInline className="max-h-full max-w-full rounded-lg" />
          ) : (
            <motion.img
              key={item.id}
              src={src}
              alt={item.originalFileName}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          )}
        </AnimatePresence>

        {hasPrev && (
          <button type="button" onClick={() => onIndexChange(index - 1)} className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm transition-colors hover:bg-background/20 sm:left-4">
            <ChevronLeft className="size-5" />
          </button>
        )}
        {hasNext && (
          <button type="button" onClick={() => onIndexChange(index + 1)} className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/10 backdrop-blur-sm transition-colors hover:bg-background/20 sm:right-4">
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}