import { Heart, Play, RotateCcw, Trash2 } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { motion } from 'framer-motion'
import {useState } from 'react'
import { cn } from '../../utils/utils'
export function MediaTile({ item, onOpen, onToggleFavorite, onDelete, onRecover }) {
  const [loaded, setLoaded] = useState(false)
  const isVideo = item.type === 1
  const src = getMediaUrl(item.storagePath)

  const iconButtonClass =
    'flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60'

  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.98 }}
        className="absolute inset-0 block h-full w-full"
      >
        {isVideo ? (
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.img
            src={src}
            alt={item.originalFileName}
            onLoad={() => setLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
      </motion.button>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(item) }}
          aria-label="Mover a la papelera"
          className={cn(iconButtonClass, 'absolute left-2 top-2 z-10 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100')}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      )}

      {onRecover && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRecover(item) }}
          aria-label="Recuperar de la papelera"
          className={cn(iconButtonClass, 'absolute left-2 top-2 z-10 [@media(hover:none)]:opacity-100')}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      )}

      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item) }}
          aria-label={item.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          aria-pressed={item.isFavorite}
          className={cn(
            iconButtonClass,
            'absolute right-2 top-2 z-10 [@media(hover:none)]:opacity-100',
            item.isFavorite ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
          )}
        >
          <Heart className={cn('size-4', item.isFavorite && 'fill-highlight text-highlight')} aria-hidden="true" />
        </button>
      )}

      {isVideo && (
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-foreground/60 px-2 py-0.5 font-mono text-[11px] font-medium text-background backdrop-blur-sm">
          <Play className="size-3 fill-current" aria-hidden="true" />
        </span>
      )}
    </div>
  )
}