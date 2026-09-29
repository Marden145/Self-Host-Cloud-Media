import { Play } from 'lucide-react'
import { getMediaUrl } from '../../utils/getMediaUrl'
export function MediaTile({ item, onOpen }) {
  const isVideo = item.type === 1
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-square overflow-hidden bg-muted"
    >
      {isVideo ? (
        <video src={getMediaUrl(item.storagePath)} muted playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
      ) : (
        <img
          src={getMediaUrl(item.storagePath)}
          alt={item.originalFileName}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      {isVideo && (
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-foreground/60 px-2 py-0.5 font-mono text-[11px] font-medium text-background backdrop-blur-sm">
          <Play className="size-3 fill-current" aria-hidden="true" />
        </span>
      )}
    </button>
  )
}