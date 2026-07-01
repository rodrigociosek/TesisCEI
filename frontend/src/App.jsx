import { Routes, Route } from 'react-router-dom'
import Registro from './pages/Registro'
import Verificar from './pages/Verificar'
import Inicio from './pages/Inicio'

function App() {
  return (
    <Routes>
      <Route path='/registro' element={<Registro />} />
      <Route path='/verificar' element={<Verificar />} />
      <Route path='/inicio' element={<Inicio />} />
    </Routes>
  )
}

export default App