const repartoServicio = require('../services/reparto.servicio')

async function generarPlan(req, res, next) {
  const { pedidoIds } = req.body

  if (!Array.isArray(pedidoIds) || pedidoIds.length < 2) {
    return res.status(400).json({ error: 'Seleccioná al menos dos pedidos para generar la planificación.' })
  }

  try {
    const resultado = await repartoServicio.generarPlanCarga(req.usuario.id, pedidoIds)
    res.status(201).json(resultado)
  } catch (error) {
    next(error)
  }
}

async function listarPlanes(req, res, next) {
  try {
    const planes = await repartoServicio.obtenerPlanes(req.usuario.id)
    res.json(planes)
  } catch (error) {
    next(error)
  }
}

async function obtenerDetalle(req, res, next) {
  const planId = Number(req.params.id)
  try {
    const detalle = await repartoServicio.obtenerDetalle(req.usuario.id, planId)
    res.json(detalle)
  } catch (error) {
    next(error)
  }
}

async function editarPedidos(req, res, next) {
  const planId = Number(req.params.id)
  const { pedidoIds } = req.body

  if (!Array.isArray(pedidoIds)) {
    return res.status(400).json({ error: 'Formato de pedidos inválido.' })
  }

  try {
    const resultado = await repartoServicio.editarPedidos(req.usuario.id, planId, pedidoIds)
    res.json(resultado)
  } catch (error) {
    next(error)
  }
}

module.exports = { generarPlan, listarPlanes, obtenerDetalle, editarPedidos }
