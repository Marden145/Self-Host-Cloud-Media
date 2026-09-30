import api from './api'
export async function saveMedia(mediaData) {
  const response = await api.post('/Media', mediaData)
  return response.data
}
export async function getMedia(pageIndex, pageSize) {
  const response = await api.get(`/Media/Media/${pageIndex}/${pageSize}`)
  return response.data
}
export async function setFavorites(idMedia,isFavorite) {
  const response = await api.patch(`/Media/${idMedia}/favorite`, { isFavorite })
  return response.data
}
export async function getFavorites(pageIndex, pageSize) {
  const response = await api.get(`/Media/favorites/${pageIndex}/${pageSize}`)
  return response.data
}
export async function deleteMedia(idMedias) {
  const response = await api.delete('/Media/DeleteMedia', { data: idMedias })
  return response.data
}

export async function getTrash(pageIndex, pageSize) {
  const response = await api.get(`/Media/trash/${pageIndex}/${pageSize}`)
  return response.data
}

export async function recoverMedia(idMedia) {
  const response = await api.patch(`/Media/recoverMedia/${idMedia}`)
  return response.data
}
