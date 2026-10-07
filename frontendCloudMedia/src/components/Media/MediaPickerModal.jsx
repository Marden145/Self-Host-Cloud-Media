import { useState } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../Modal'
import { useMediaList } from '../../hooks/useMediaList'
import { getMedia } from '../../services/mediaService'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { cn } from '../../utils/utils'

export function MediaPickerModal({ open, onClose, onConfirm, excludeIds = [] }) {
  const { items, loading, loadingMore, hasMorePages, loadMore } = useMediaList(getMedia)
  const [selected, setSelected] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)

  const availableItems = items.filter((i) => !excludeIds.includes(i.id))

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onConfirm(Array.from(selected))
      setSelected(new Set())
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Agregar fotos al álbum">
      <div className="flex max-h-[60vh] flex-col gap-4">
        <div className="-mx-1 grid grid-cols-4 gap-1 overflow-y-auto px-1 sm:grid-cols-5">
          {loading && <p className="col-span-full py-8 text-center text-sm text-muted-foreground">Cargando...</p>}
          {!loading && availableItems.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No hay fotos disponibles</p>
          )}
          {availableItems.map((item) => {
            const isSelected = selected.has(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSelect(item.id)}
                className="relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={getMediaUrl(item.storagePath)}
                  alt={item.originalFileName}
                  className={cn('h-full w-full object-cover transition-opacity', isSelected && 'opacity-60')}
                />
                <span
                  className={cn(
                    'absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white/90 transition-colors',
                    isSelected ? 'bg-highlight' : 'bg-black/20',
                  )}
                >
                  {isSelected && <Check className="size-3 text-highlight-foreground" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
          {hasMorePages && !loading && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="col-span-full mt-2 h-9 rounded-lg border border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {loadingMore ? 'Cargando...' : 'Cargar más'}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {selected.size} seleccionada{selected.size === 1 ? '' : 's'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0 || submitting}
              className="h-10 rounded-full bg-highlight px-4 text-sm font-medium text-highlight-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}