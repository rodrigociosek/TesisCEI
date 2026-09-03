const Distribuidor = require('../models/Distribuidor')
const PlanReparto = require('../models/PlanReparto')

async function obtenerPlanes(usuarioId) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  return PlanReparto.listarPorDistribuidor(distribuidor.id)
}

module.exports = { obtenerPlanes }
