import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import  Gallery  from './pages/Gallery'
import Favorites from './pages/Favorites'
import Trash from './pages/Trash'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/papelera" element={<Trash />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
