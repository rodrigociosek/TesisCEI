import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { tokenValido } from '../lib/auth'

// RNF-005: las funciones de comprador (historial, carrito, checkout) son
// inaccesibles sin sesión activa.
export function RutaProtegida() {
  const location = useLocation()
  if (!tokenValido()) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

// RNF-005: las funciones del modo distribuidor son inaccesibles para
// usuarios en modo comprador. Sin perfil de distribuidor activo, se
// redirige a configurarlo — mismo destino que ya usa el link "Distribuidora"
// del header cuando modoDistribuidorActivo es false.
export function RutaDistribuidor() {
  const location = useLocation()
  if (!tokenValido()) return <Navigate to="/login" replace state={{ from: location }} />
  if (localStorage.getItem('modoDistribuidorActivo') !== 'true') {
    return <Navigate to="/configurarPerfil" replace />
  }
  return <Outlet />
}
