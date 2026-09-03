import PrecioVolumen from '../models/PrecioVolumen.js'
import Producto from '../models/Producto.js'

const validarDatos = PrecioVolumen.validarDatos

async function verificarProductoDelDistribuidor(productoId, usuarioId) {
  const producto = await Producto.obtenerPropio(productoId, usuarioId)
  if (!producto) {
    const e = new Error()
    e.status = 404
    e.mensaje = 'Producto no encontrado.'
    throw e
  }
}

async function listarPrecios(productoId, usuarioId) {
  await verificarProductoDelDistribuidor(productoId, usuarioId)
  return PrecioVolumen.listarPorProducto(productoId)
}

async function registrarPrecio(productoId, usuarioId, datos) {
  const { cantidadMinima, precioVenta, precioCosto } = datos
  PrecioVolumen.validarDatos(precioVenta, precioCosto, cantidadMinima)
  await verificarProductoDelDistribuidor(productoId, usuarioId)
  return PrecioVolumen.crear(productoId, cantidadMinima, precioVenta, precioCosto)
}

async function editarPrecio(productoId, precioId, usuarioId, datos) {
  const { cantidadMinima, precioVenta, precioCosto } = datos
  PrecioVolumen.validarDatos(precioVenta, precioCosto, cantidadMinima)
  await verificarProductoDelDistribuidor(productoId, usuarioId)

  const precio = await PrecioVolumen.obtenerPorId(precioId, productoId)
  if (!precio) {
    const e = new Error()
    e.status = 404
    e.mensaje = 'Precio no encontrado.'
    throw e
  }
  await precio.editar(cantidadMinima, precioVenta, precioCosto)
  return precio
}

async function eliminarPrecio(productoId, precioId, usuarioId) {
  await verificarProductoDelDistribuidor(productoId, usuarioId)

  const precio = await PrecioVolumen.obtenerPorId(precioId, productoId)
  if (!precio) {
    const e = new Error()
    e.status = 404
    e.mensaje = 'Precio no encontrado.'
    throw e
  }

  return precio.eliminar()
}

export { validarDatos, listarPrecios, registrarPrecio, editarPrecio, eliminarPrecio }
