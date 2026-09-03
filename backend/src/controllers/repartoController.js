const repartoServicio = require('../services/reparto.servicio')

async function listarPlanes(req, res, next) {
  try {
    const planes = await repartoServicio.obtenerPlanes(req.usuario.id)
    res.json(planes)
  } catch (error) {
    next(error)
  }
}

module.exports = { listarPlanes }
