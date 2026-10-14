import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImagePlus, X } from 'lucide-react'
import { MediaPickerModal } from '../Media/MediaPickerModal'
import { getMediaUrl } from '../../utils/getMediaUrl'
import { isImage } from '../../utils/mediaType'

export function AlbumForm({ onSubmit, onCancel, submitting, initialCover = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } })

  const [cover, setCover] = useState(initialCover) // { id, storagePath, originalFileName? } | null
  const [pickerOpen, setPickerOpen] = useState(false)

  const onValid = async (data) => {
    await onSubmit({ name: data.name.trim(), cover })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="album-name" className="text-sm font-medium text-muted-foreground">
            Nombre del álbum
          </label>
          <input
            id="album-name"
            type="text"
            placeholder="Ej. Vacaciones 2026"
            autoFocus
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' },
              maxLength: { value: 80, message: 'Máximo 80 caracteres' },
              validate: (value) => value.trim().length > 0 || 'El nombre no puede estar vacío',
            })}
            aria-invalid={errors.name ? 'true' : 'false'}
            className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus-visible:ring-red-300"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Portada <span className="font-normal">(opcional)</span>
          </p>

          {cover ? (
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-border p-2">
              <img
                src={getMediaUrl(cover.storagePath)}
                alt=""
                className="size-14 shrink-0 rounded-md object-cover"
              />
              <p className="min-w-0 flex-1 truncate text-sm">
                {cover.originalFileName ?? 'Portada seleccionada'}
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => setCover(null)}
                aria-label="Quitar portada"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-1.5 flex h-20 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              Elegir portada
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-10 rounded-full bg-highlight px-4 text-sm font-medium text-highlight-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear álbum'}
          </button>
        </div>
      </form>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={([chosen]) => setCover(chosen)}
        excludeIds={cover ? [cover.id] : []}
        multiple={false}
        filterItem={isImage}
        title="Elegir portada"
        confirmLabel="Usar como portada"
      />
    </>
  )
}