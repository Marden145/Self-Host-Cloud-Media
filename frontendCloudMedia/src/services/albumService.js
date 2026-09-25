import api from './api'
export async function saveMedia(mediaData) {
  const response = await api.post('/Media', mediaData)
  return response.data
}
export async function getMedia(pageIndex, pageSize) {
  const response = await api.get(`/Media/Media/${pageIndex}/${pageSize}`)
  return response.data
}
export async function setFavorites(idMedia,setFavoritesRequest) {
  const response = await api.patch(`/Media/DeleteMedia/${idMedia}`, setFavoritesRequest)
  return response.data
}
export async function getFavorites(pageIndex, pageSize) {
  const response = await api.get(`/Media/favorites/${pageIndex}/${pageSize}`)
  return response.data
}

