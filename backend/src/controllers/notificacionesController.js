import * as notificacionesServicio from '../services/notificaciones.servicio.js'
import { esIdValido } from '../middleware/validaciones.js'

const MODOS_VALIDOS = ['comprador', 'distribuidor']

async function listar(req, res, next) {
  const modo = req.query.modo || 'comprador'
  if (!MODOS_VALIDOS.includes(modo)) {
    return res.status(400).json({ error: 'El modo de notificaciones no es válido.' })
  }

  try {
    const notificaciones = await notificacionesServicio.obtenerPorUsuario(req.usuario.id, modo)
    res.json(notificaciones)
  } catch (error) {
    next(error)
  }
}

async function marcarLeida(req, res, next) {
  const id = Number(req.params.id)
  if (!esIdValido(id)) {
    return res.json({ ok: true })
  }
  try {
    await notificacionesServicio.marcarComoLeida(id, req.usuario.id)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
}

export { listar, marcarLeida }
