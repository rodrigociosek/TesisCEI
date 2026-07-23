import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import '../modoDistribuidor/Inicio.css'
import './InicioComprador.css'

const NAV_ITEMS = [
  { label: 'Catálogo', ruta: '/inicioComprador' },
  { label: 'Mis pedidos', ruta: '/misPedidos' },
  { label: 'Mi perfil', ruta: '/miPerfil' },
]

function InicioComprador() {
  const navigate = useNavigate()
  const location = useLocation()
  const nombre = localStorage.getItem('nombre') || ''
  const modoDistribuidorActivo = localStorage.getItem('modoDistribuidorActivo') === 'true'
  const iniciales = nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3000/api/catalogo')
      .then(res => setProductos(res.data))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [])

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('telefono')
    localStorage.removeItem('modoDistribuidorActivo')
    navigate('/')
  }

  return (
    <div className="panel-root">

      <header className="panel-master-header">
        <div className="panel-master-header-marca">MarketDist</div>
        <div className="panel-master-header-buscador">
          <span className="panel-master-header-buscador-icono">⌕</span>
          <span className="panel-master-header-buscador-texto">Buscar productos…</span>
        </div>
        <div className="panel-master-header-perfil">
          <div className="panel-master-header-avatar">{iniciales}</div>
        </div>
      </header>

      <div className="panel-layout">

        <aside className="panel-sidebar">
          <div className="panel-sidebar-marca">
            <div className="panel-sidebar-titulo">MarketDist</div>
            <div className="panel-sidebar-subtitulo">Modo Comprador</div>
          </div>

          <nav className="panel-nav">
            {NAV_ITEMS.map(item => (
              <div
                key={item.ruta}
                className={`panel-nav-item${location.pathname === item.ruta ? ' activo' : ''}`}
                onClick={() => navigate(item.ruta)}
              >
                {item.label}
              </div>
            ))}
          </nav>

          <div className="panel-sidebar-cambiar-modo">
            {modoDistribuidorActivo
              ? <button className="panel-sidebar-cambiar-btn" onClick={() => navigate('/inicio')}>← Cambiar a modo distribuidor</button>
              : <button className="panel-sidebar-cambiar-btn" onClick={() => navigate('/configurarPerfil')}>← Activar modo distribuidor</button>
            }
          </div>

          <div className="panel-sidebar-footer">
            <div className="panel-sidebar-usuario">
              <div className="panel-avatar-small">{iniciales}</div>
              <div>
                <div className="panel-sidebar-nombre">{nombre}</div>
                <div className="panel-sidebar-rol">Comprador</div>
              </div>
            </div>
            <div className="panel-sidebar-accion" onClick={handleCerrarSesion}>Cerrar sesión</div>
          </div>
        </aside>

        <main className="panel-main">
          <div className="panel-contenido">

          <div className="panel-seccion-header">
            <div>
              <h1 className="panel-h1">Catálogo</h1>
              <p className="panel-subtitulo">Explorá los productos disponibles.</p>
            </div>
          </div>

          {cargando && (
            <div className="panel-tabla-vacio">Cargando productos...</div>
          )}

          {!cargando && productos.length === 0 && (
            <div className="panel-tabla-vacio">No hay productos disponibles en este momento.</div>
          )}

          {!cargando && productos.length > 0 && (
            <>
              <div className="comprador-grilla">
                {productos.map(p => (
                  <div key={p.id} className="comprador-tarjeta">
                    {p.imagenUrl
                      ? <img src={`http://localhost:3000${p.imagenUrl}`} alt={p.nombre} className="comprador-tarjeta-imagen" />
                      : <div className="comprador-tarjeta-imagen-placeholder">Sin imagen</div>
                    }
                    <div className="comprador-tarjeta-cuerpo">
                      <div className="comprador-tarjeta-categoria">{p.categoria}</div>
                      <div className="comprador-tarjeta-nombre">{p.nombre}</div>
                      {p.descripcion && (
                        <div className="comprador-tarjeta-descripcion">{p.descripcion}</div>
                      )}
                      <div className="comprador-tarjeta-pie">
                        <div className="comprador-tarjeta-distribuidor">{p.nombreDistribuidor}</div>
                        <div className="comprador-tarjeta-precio">
                          Desde ${Number(p.precioMinimo).toLocaleString('es-AR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-tabla-contador">
                {productos.length} producto{productos.length !== 1 ? 's' : ''} disponible{productos.length !== 1 ? 's' : ''}
              </div>
            </>
          )}

          </div>
        </main>

      </div>
    </div>
  )
}

export default InicioComprador
