import { Play,Heart } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { motion } from 'framer-motion'
import {useState } from 'react'
import { cn } from '../../utils/utils'
export function MediaTile({ item, onOpen ,onToggleFavorite }) {
  const [loaded, setLoaded] = useState(false)
  const isVideo = item.type === 1
  const src = getMediaUrl(item.storagePath)

  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-md bg-muted">
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

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(item)
        }}
        aria-label={item.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        aria-pressed={item.isFavorite}
        className={cn(
          'absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-opacity',
          item.isFavorite ? 'opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
        )}
      >
        <Heart
          className={cn('size-4 drop-shadow', item.isFavorite && 'fill-rose-500 text-rose-500')}
          aria-hidden="true"
        />
      </button>

      {isVideo && (
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-foreground/60 px-2 py-0.5 font-mono text-[11px] font-medium text-background backdrop-blur-sm">
          <Play className="size-3 fill-current" aria-hidden="true" />
        </span>
      )}
    </div>
  )
}