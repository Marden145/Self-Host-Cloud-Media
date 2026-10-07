import { useForm } from 'react-hook-form'

export function AlbumForm({ onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } })

  const onValid = async (data) => {
    await onSubmit(data.name.trim())
  }

  return (
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
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
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
  )
}