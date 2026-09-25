import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { loginWithGoogle } from '../services/authService'

function Login() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSuccess = async (credentialResponse) => {
    setError(null)
    setLoading(true)

    try {
      const idToken = credentialResponse.credential
      const token = await loginWithGoogle(idToken)

      if (!token.validacionExitosa) {
        setError('No se pudo iniciar sesión con Google.')
        return
      }

      console.log('Token recibido:', token.accessToken)
      // por ahora solo lo mostramos en consola para probar que funciona
      // luego aquí guardamos el token y redirigimos
    } catch (err) {
      setError('Ocurrió un error al conectar con el servidor.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
      <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>

      {loading && <p className="text-gray-500 mb-4">Verificando...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('El login con Google falló.')}
          size="large"
          shape="pill"
          width="280"
        />
      </div>
    </div>
  </div>
)
}

export default Login