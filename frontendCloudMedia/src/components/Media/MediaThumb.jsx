import { useState } from 'react'
import { Play } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { cn } from '../../utils/utils'

export function MediaThumb({ item, className }) {
  const [loaded, setLoaded] = useState(false)
  const isVideo = item.type === 1
  const src = getMediaUrl(item.storagePath)

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-muted', className)}>
      {isVideo ? (
        <video
          src={`${src}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt={item.originalFileName}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}

      {isVideo && (
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 inline-flex items-center rounded-full bg-black/60 p-1 text-white backdrop-blur-sm">
          <Play className="size-3 fill-current" aria-hidden="true" />
        </span>
      )}
    </div>
  )
}