export function getMediaUrl(storagePath) {
  return `${import.meta.env.VITE_MEDIA_BASE_URL}/${storagePath}`
}