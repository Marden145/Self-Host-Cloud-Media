const TOKEN_KEY = 'TokenResponse'
export const session = {
  read() {
    try {
      const data = localStorage.getItem(TOKEN_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null // JSON corrupto: se trata como sin sesión
    }
  },
  save(tokenResponse) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenResponse))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}