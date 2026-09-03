const Distribuidor = require('../models/Distribuidor')
const Pedido = require('../models/Pedido')
const PlanReparto = require('../models/PlanReparto')

async function generarPlanCarga(usuarioId, pedidoIds) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  if (distribuidor.latitud == null || distribuidor.longitud == null) {
    throw Object.assign(new Error('Registrá la dirección de partida del depósito antes de generar el plan.'), { status: 400 })
  }

  const disponibles = await Pedido.listarDisponiblesRepartoDistribuidor(usuarioId)
  const idsSolicitados = new Set(pedidoIds.map(Number))
  const seleccionados = disponibles.filter(p => idsSolicitados.has(p.id))

  if (seleccionados.length < 2) {
    throw Object.assign(new Error('Seleccioná al menos dos pedidos para generar la planificación.'), { status: 400 })
  }

  return PlanReparto.generarPlanCarga(distribuidor.id, distribuidor.latitud, distribuidor.longitud, seleccionados)
}

async function obtenerPlanes(usuarioId) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  return PlanReparto.listarPorDistribuidor(distribuidor.id)
}

async function obtenerDetalle(usuarioId, planId) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  const detalle = await PlanReparto.obtenerDetalle(planId, distribuidor.id)
  if (!detalle) {
    throw Object.assign(new Error('El reparto no existe.'), { status: 404 })
  }
  return detalle
}

module.exports = { generarPlanCarga, obtenerPlanes, obtenerDetalle }
