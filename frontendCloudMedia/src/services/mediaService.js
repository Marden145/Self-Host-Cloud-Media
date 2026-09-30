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

