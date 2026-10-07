import {  useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Sidebar } from '../components/Media/Sidebar'
import { TopBar } from '../components/Media/TopBar'
import { AlbumCard } from '../components/Album/AlbumCard'
import { Modal } from '../components/Modal'
import { AlbumForm } from '../components/Album/AlbumForm'
import { saveMedia } from '../services/mediaService'
import { useAlbums } from '../hooks/useAlbums'
import { AnimatePresence } from 'framer-motion'
function Albums() {
const { albums, loading, error, handleCreateAlbum, handleDeleteAlbum } = useAlbums()
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleAddMedia = async (files) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      await saveMedia(formData)
    }
  }

  const onCreateSubmit = async (name) => {
    setCreating(true)
    try {
      await handleCreateAlbum(name)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

 

 return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onAddMedia={handleAddMedia} />
        <main className="flex flex-col gap-6 pb-16 pt-6">
          <div className="flex items-center justify-between px-4 lg:px-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Álbumes</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {albums.length} álbum{albums.length === 1 ? '' : 'es'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <FolderPlus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nuevo álbum</span>
            </button>
          </div>

          {loading && <p className="px-4 text-sm text-muted-foreground lg:px-8">Cargando...</p>}
          {error && <p className="px-4 text-sm text-red-500 lg:px-8">{error}</p>}

          {!loading && !error && albums.length === 0 && (
            <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-20 text-center lg:mx-8">
              <FolderPlus className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium">Aún no tienes álbumes</p>
              <p className="max-w-sm text-sm text-muted-foreground">Crea uno para empezar a organizar tus fotos.</p>
            </div>
          )}

          {!loading && !error && albums.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:px-8 2xl:grid-cols-6">
              <AnimatePresence>
                {albums.map((album, i) => (
                  <li key={album.idAlbum}>
                    <AlbumCard album={album} index={i} onDelete={() => handleDeleteAlbum(album.idAlbum)} />
                  </li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </main>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo álbum">
        <AlbumForm onSubmit={onCreateSubmit} onCancel={() => setModalOpen(false)} submitting={creating} />
      </Modal>
    </div>
  )
}

export default Albums