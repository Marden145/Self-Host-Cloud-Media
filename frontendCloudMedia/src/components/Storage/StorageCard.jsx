import { motion } from 'framer-motion'
import { AlertTriangle, HardDrive } from 'lucide-react'
import { useStorage } from '../../context/StorageContext'
import { formatGB } from '../../utils/formatStorage'
import { cn } from '../../utils/utils'

const LEVELS = {
  normal: { bar: 'bg-highlight', dot: 'bg-highlight', text: 'text-highlight' },
  warning: { bar: 'bg-amber-500', dot: 'bg-amber-500', text: 'text-amber-600' },
  critical: { bar: 'bg-red-500', dot: 'bg-red-500', text: 'text-red-500' },
}

function getLevel(percent) {
  if (percent >= 90) return 'critical'
  if (percent >= 75) return 'warning'
  return 'normal'
}

function StorageSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4" aria-hidden="true">
      <div className="flex items-center gap-2.5">
        <div className="size-8 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 h-2 animate-pulse rounded-full bg-muted" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-8 animate-pulse rounded bg-muted" />
        <div className="h-8 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function StorageCard() {
  const { storage, loading, error, refresh } = useStorage()

  if (loading) return <StorageSkeleton />

  if (!storage) {
    if (!error) return null // 204: todavía no hay datos que mostrar
    return (
      <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
        <p>{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const { totalStorage, totalStorageUsed, totalStorageAvailable } = storage
  const percent = totalStorage > 0 ? Math.min(100, (totalStorageUsed / totalStorage) * 100) : 0
  const barWidth = totalStorageUsed > 0 ? Math.max(percent, 2) : 0 // mínimo visible si hay algo usado
  const percentLabel = percent > 0 && percent < 1 ? '<1%' : `${Math.round(percent)}%`
  const level = getLevel(percent)
  const styles = LEVELS[level]

  return (
    <section aria-label="Almacenamiento" className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <HardDrive className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium leading-tight">Almacenamiento</p>
            <p className="text-xs text-muted-foreground">{formatGB(totalStorage)} en total</p>
          </div>
        </div>
        <span className={cn('text-sm font-semibold tabular-nums', styles.text)}>{percentLabel}</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Espacio de almacenamiento utilizado"
        className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className={cn('h-full rounded-full', styles.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('size-2 rounded-full', styles.dot)} aria-hidden="true" />
            Usado
          </dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">{formatGB(totalStorageUsed)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-border" aria-hidden="true" />
            Libre
          </dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">{formatGB(totalStorageAvailable)}</dd>
        </div>
      </dl>

      {level !== 'normal' && (
        <p role="status" className={cn('mt-3 flex items-start gap-1.5 text-xs', styles.text)}>
          <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {level === 'critical'
            ? 'Casi sin espacio. Libera archivos para seguir subiendo.'
            : 'Te queda poco espacio disponible.'}
        </p>
      )}
    </section>
  )
}