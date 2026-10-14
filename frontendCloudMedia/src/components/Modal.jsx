import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../utils/utils'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl h-[85dvh]',
  xl: 'max-w-5xl h-[88dvh]',
}

// Pila de modales abiertos: el último es el que está encima.
const openModals = []

export function Modal({ open, onClose, title, children, size = 'sm', closeOnOverlay = true }) {
  const id = useId()
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    openModals.push(id)
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape' && openModals.at(-1) === id) onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      openModals.splice(openModals.indexOf(id), 1)
      if (openModals.length === 0) document.body.style.overflow = ''
    }
  }, [open, id])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 py-6 backdrop-blur-sm"
          onClick={closeOnOverlay ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'flex max-h-[90dvh] w-full flex-col rounded-2xl bg-card p-5 shadow-xl sm:p-6',
              SIZES[size],
            )}
          >
            <div className="flex shrink-0 items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}