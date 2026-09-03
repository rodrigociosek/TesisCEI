const pool = require('../config/db')
const Pedido = require('../models/Pedido')
const PropuestaSustitucion = require('../models/PropuestaSustitucion')
const Producto = require('../models/Producto')
const Notificacion = require('../models/Notificacion')

async function confirmarPedido(compradorId, direccionEntrega, latitud, longitud, items) {
  return Pedido.confirmarDesdeCarrito(compradorId, direccionEntrega, latitud, longitud, items)
}

async function obtenerHistorialDistribuidor(usuarioId) {
  return Pedido.listarHistorialDistribuidor(usuarioId)
}

async function obtenerHistorialComprador(compradorId) {
  return Pedido.listarHistorialComprador(compradorId)
}

async function obtenerPedidosActivos(usuarioId) {
  return Pedido.listarActivosDistribuidor(usuarioId)
}

async function obtenerDetalleComprador(pedidoId, compradorId) {
  const detalle = await Pedido.obtenerDetalleComprador(pedidoId, compradorId)
  if (!detalle) {
    throw Object.assign(new Error('Pedido no encontrado.'), { status: 404 })
  }
  return detalle
}

async function obtenerDetalleDistribuidor(pedidoId, distribuidorUsuarioId) {
  const detalle = await Pedido.obtenerDetalleDistribuidor(pedidoId, distribuidorUsuarioId)
  if (!detalle) {
    throw Object.assign(new Error('Pedido no encontrado.'), { status: 404 })
  }
  return detalle
}

async function obtenerPedidoPropio(pedidoId, distribuidorUsuarioId) {
  const pedido = await Pedido.obtenerPropioDistribuidor(pedidoId, distribuidorUsuarioId)
  if (!pedido) {
    throw Object.assign(new Error('Pedido no encontrado.'), { status: 404 })
  }
  return pedido
}

async function aceptarPedido(pedidoId, distribuidorUsuarioId) {
  const pedido = await obtenerPedidoPropio(pedidoId, distribuidorUsuarioId)
  return pedido.aceptar(distribuidorUsuarioId)
}

async function rechazarPedido(pedidoId, distribuidorUsuarioId, motivo) {
  const pedido = await obtenerPedidoPropio(pedidoId, distribuidorUsuarioId)
  return pedido.rechazar(motivo)
}

async function avanzarEstado(pedidoId, distribuidorUsuarioId) {
  const pedido = await obtenerPedidoPropio(pedidoId, distribuidorUsuarioId)
  return pedido.avanzarEstado()
}

// RF-025
async function proponerSustituto(pedidoId, distribuidorUsuarioId, pedidoItemId, productoSustitutoId) {
  const pedido = await obtenerPedidoPropio(pedidoId, distribuidorUsuarioId)
  return pedido.proponerSustituto(pedidoItemId, productoSustitutoId)
}

// RF-026: el comprador acepta o rechaza una propuesta de sustitución. Al
// aceptar, el comprador es quien define la cantidad — el precio se calcula
// para esa cantidad en ese momento, igual que al confirmar un pedido nuevo.
async function responderSustitucion(propuestaId, compradorId, respuesta, cantidad) {
  const contexto = await PropuestaSustitucion.obtenerConContexto(propuestaId)
  if (!contexto || contexto.compradorId !== compradorId) {
    throw Object.assign(new Error('Propuesta no encontrada.'), { status: 404 })
  }
  if (contexto.estadoPedido !== 'pendiente') {
    throw Object.assign(new Error('Esta propuesta ya no puede responderse porque el pedido cambió de estado.'), { status: 409 })
  }

  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')

    if (respuesta === 'aceptar') {
      // precio_volumen.cantidad_minima es integer en la base: una cantidad
      // fraccionaria rompe la consulta de precio aplicable con un error
      // crudo de SQL en vez de un mensaje entendible, así que se valida acá.
      if (!cantidad || !Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
        throw Object.assign(new Error('Ingresá la cantidad del producto sustituto antes de aceptar la propuesta.'), { status: 400 })
      }
      const precioAplicable = await Producto.obtenerPrecioVolumenAplicable(contexto.propuesta.productoSustitutoId, cantidad, cliente)
      if (!precioAplicable) {
        throw Object.assign(new Error('No hay un precio por volumen disponible para la cantidad ingresada.'), { status: 400 })
      }
      await contexto.propuesta.aceptar(cantidad, precioAplicable.id, precioAplicable.precioVenta, cliente)
    } else {
      await contexto.propuesta.rechazar(cliente)
    }

    const resultado = respuesta === 'aceptar' ? 'aceptó' : 'rechazó'
    await Notificacion.crear(
      contexto.distribuidorUsuarioId,
      'sustitucion_respondida',
      `El comprador ${resultado} tu propuesta de sustituir ${contexto.nombreProductoOriginal} por ${contexto.nombreProductoSustituto} en el pedido #${contexto.pedidoId}.`,
      contexto.pedidoId,
      cliente
    )

    await cliente.query('COMMIT')
    return { id: contexto.propuesta.id, estado: contexto.propuesta.estado }
  } catch (error) {
    await cliente.query('ROLLBACK')
    throw error
  } finally {
    cliente.release()
  }
}

module.exports = { confirmarPedido, obtenerHistorialDistribuidor, obtenerHistorialComprador, obtenerPedidosActivos, obtenerDetalleComprador, obtenerDetalleDistribuidor, aceptarPedido, rechazarPedido, avanzarEstado, proponerSustituto, responderSustitucion }
