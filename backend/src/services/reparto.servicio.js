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

async function editarPedidos(usuarioId, planId, pedidoIds) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  if (distribuidor.latitud == null || distribuidor.longitud == null) {
    throw Object.assign(new Error('Registrá la dirección de partida del depósito antes de generar el plan.'), { status: 400 })
  }

  const disponibles = await Pedido.listarDisponiblesRepartoDistribuidor(usuarioId, planId)
  const idsSolicitados = new Set(pedidoIds.map(Number))
  const seleccionados = disponibles.filter(p => idsSolicitados.has(p.id))

  const resultado = await PlanReparto.editarPedidos(planId, distribuidor.id, seleccionados, distribuidor.latitud, distribuidor.longitud, distribuidor.nombreComercial)
  if (!resultado) {
    throw Object.assign(new Error('El reparto no existe o ya está finalizado.'), { status: 404 })
  }
  return resultado
}

async function eliminarReparto(usuarioId, planId) {
  const distribuidor = await Distribuidor.obtenerPorUsuarioId(usuarioId)
  if (!distribuidor) {
    throw Object.assign(new Error('No tenés un perfil de distribuidor configurado.'), { status: 404 })
  }

  const resultado = await PlanReparto.eliminar(planId, distribuidor.id)
  if (resultado === 'no_encontrado') {
    throw Object.assign(new Error('El reparto no existe.'), { status: 404 })
  }
  if (resultado === 'no_es_sin_empezar') {
    throw Object.assign(new Error('Este plan tiene paradas ya marcadas y no puede eliminarse.'), { status: 409 })
  }
  return { mensaje: 'El plan de reparto fue eliminado correctamente.' }
}

module.exports = { generarPlanCarga, obtenerPlanes, obtenerDetalle, editarPedidos, eliminarReparto }
