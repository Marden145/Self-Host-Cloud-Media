import { useState } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../Modal'
import { useMediaList } from '../../hooks/useMediaList'
import { getMedia } from '../../services/mediaService'
import { cn } from '../../utils/utils'
import { MediaThumb } from './MediaThumb'

function PickerBody({ onClose, onConfirm, excludeIds }) {
  const { items, loading, loadingMore, hasMorePages, loadMore } = useMediaList(getMedia, { pageSize: 48 })
  const [selected, setSelected] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)

  const available = items.filter((i) => !excludeIds.includes(i.id))

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleConfirm = async () => {
  setSubmitting(true)
  try {
    const chosen = available.filter((i) => selected.has(i.id))
    await onConfirm(chosen)
    onClose()
  } catch (err) {
    console.error(err)
    setSubmitting(false)
  }
}

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && <p className="py-10 text-center text-sm text-muted-foreground">Cargando...</p>}

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {available.map((item) => {
            const isSelected = selected.has(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    'relative block aspect-square w-full overflow-hidden rounded-lg',
                    isSelected && 'ring-2 ring-highlight ring-offset-2 ring-offset-card',
                  )}
                >
                  <MediaThumb item={item} />
                  {isSelected && (
                    <span className="absolute left-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {hasMorePages && !loading && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="mt-3 h-9 w-full rounded-lg border border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">{selected.size} seleccionados</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.size === 0 || submitting}
            className="h-10 rounded-full bg-highlight px-4 text-sm font-medium text-highlight-foreground disabled:opacity-50"
          >
            {submitting ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function MediaPickerModal({ open, onClose, onConfirm, excludeIds = [] }) {
  return (
    <Modal open={open} onClose={onClose} title="Agregar al álbum" size="xl">
      <PickerBody onClose={onClose} onConfirm={onConfirm} excludeIds={excludeIds} />
    </Modal>
  )
}