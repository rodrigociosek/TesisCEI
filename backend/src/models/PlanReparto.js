const pool = require('../config/db')
const ParadaReparto = require('./ParadaReparto')
const Pedido = require('./Pedido')
const Notificacion = require('./Notificacion')

const RADIO_TIERRA_KM = 6371
const OSRM_TABLE_URL = 'https://router.project-osrm.org/table/v1/driving'
const OSRM_TIMEOUT_MS = 5000

// RF-044 (respaldo): distancia en línea recta entre dos coordenadas
// (fórmula de Haversine). Ya no es el cálculo principal — ver
// obtenerDistanciasReales — pero se mantiene como respaldo para cuando
// OSRM no responde, porque el servidor público de OSRM no da garantía de
// disponibilidad (es un demo, no un servicio de producción) y crear un
// reparto no puede depender de que un tercero gratuito esté arriba.
function distanciaKm(lat1, lon1, lat2, lon2) {
  const radianes = grados => (grados * Math.PI) / 180
  const dLat = radianes(lat2 - lat1)
  const dLon = radianes(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radianes(lat1)) * Math.cos(radianes(lat2)) * Math.sin(dLon / 2) ** 2
  return RADIO_TIERRA_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// RF-044: distancia real por calles entre la dirección de partida y cada
// pedido, vía el servicio /table/ del servidor público de demo de OSRM
// (gratis, sin API key). Una sola llamada trae la distancia a todos los
// pedidos a la vez (parámetro sources=0 fija el depósito como único
// origen), así que crear o editar un reparto nunca dispara más de un
// request — muy por debajo del límite documentado de 1 request/segundo
// del servidor de demo. Devuelve un Map pedidoId → km, con solo las
// entradas que OSRM pudo resolver; si la llamada entera falla (timeout,
// error de red, respuesta no válida) devuelve null y el llamador cae a
// Haversine para todos los pedidos.
async function obtenerDistanciasReales(latitudPartida, longitudPartida, pedidosConCoordenadas) {
  if (pedidosConCoordenadas.length === 0) return new Map()

  const puntos = [
    `${longitudPartida},${latitudPartida}`,
    ...pedidosConCoordenadas.map(p => `${p.longitud},${p.latitud}`),
  ].join(';')

  try {
    const res = await fetch(
      `${OSRM_TABLE_URL}/${puntos}?sources=0&annotations=distance`,
      { signal: AbortSignal.timeout(OSRM_TIMEOUT_MS) }
    )
    if (!res.ok) return null
    const data = await res.json()
    const fila = data.distances?.[0]
    if (data.code !== 'Ok' || !fila) return null

    const resultado = new Map()
    pedidosConCoordenadas.forEach((pedido, i) => {
      const metros = fila[i + 1]
      if (typeof metros === 'number') resultado.set(pedido.id, metros / 1000)
    })
    return resultado
  } catch {
    return null
  }
}

// RF-044/RF-064: pedidos ya validados (con id, latitud, longitud), de la
// parada más cercana a la más lejana desde la dirección de partida. Los
// pedidos sin coordenadas quedan al final porque no hay forma de calcular
// su distancia — caso residual desde que RF-008 exige coordenadas siempre,
// salvo que la geocodificación de respaldo llegue a fallar. Compartida
// entre generarPlanCarga (creación) y editarPedidos (edición) porque ambas
// necesitan exactamente el mismo criterio de orden.
async function ordenarPorDistancia(pedidos, latitudPartida, longitudPartida) {
  const conCoordenadas = pedidos.filter(p => p.latitud != null && p.longitud != null)
  const distanciasReales = await obtenerDistanciasReales(latitudPartida, longitudPartida, conCoordenadas)

  const distanciaDe = (pedido) => {
    if (pedido.latitud == null || pedido.longitud == null) return Infinity
    const real = distanciasReales?.get(pedido.id)
    if (real != null) return real
    return distanciaKm(Number(latitudPartida), Number(longitudPartida), Number(pedido.latitud), Number(pedido.longitud))
  }

  return [...pedidos].sort((a, b) => distanciaDe(a) - distanciaDe(b))
}

class PlanReparto {
  constructor(data) {
    this.id = data.id
    this.distribuidorId = data.distribuidor_id
    this.estado = data.estado
    this.fechaCreacion = data.fecha_creacion
  }

  // pedidos: filas ya validadas de Pedido.listarDisponiblesRepartoDistribuidor
  // (id, direccionEntrega, nombreComprador, latitud, longitud, items).
  static async generarPlanCarga(distribuidorId, latitudPartida, longitudPartida, pedidos) {
    const ordenados = await ordenarPorDistancia(pedidos, latitudPartida, longitudPartida)

    const cliente = await pool.connect()
    try {
      await cliente.query('BEGIN')

      const resPlan = await cliente.query(
        `INSERT INTO plan_reparto (distribuidor_id, estado) VALUES ($1, 'sin_empezar') RETURNING *`,
        [distribuidorId]
      )
      const plan = new PlanReparto(resPlan.rows[0])

      const paradas = []
      for (let i = 0; i < ordenados.length; i++) {
        const resParada = await cliente.query(
          `INSERT INTO parada_reparto (plan_reparto_id, pedido_id, orden, estado_parada)
           VALUES ($1, $2, $3, 'pendiente') RETURNING *`,
          [plan.id, ordenados[i].id, i + 1]
        )
        paradas.push(new ParadaReparto(resParada.rows[0]))
      }

      await cliente.query('COMMIT')
      return { plan, paradas }
    } catch (error) {
      await cliente.query('ROLLBACK')
      if (error.code === '23505') {
        const err = new Error('Uno de los pedidos seleccionados ya forma parte de otro plan de reparto activo.')
        err.status = 409
        throw err
      }
      throw error
    } finally {
      cliente.release()
    }
  }

  // RF-063: panel con todos los repartos del distribuidor, en cualquier
  // estado, con la cantidad de paradas y cuántas ya fueron marcadas
  // (Entregado, Omitido o Rechazado), para armar la barra de progreso sin
  // entrar a cada reparto.
  static async listarPorDistribuidor(distribuidorId) {
    const res = await pool.query(
      `SELECT
         p.id, p.estado, p.fecha_creacion AS "fechaCreacion",
         COUNT(pa.id)::int AS "totalParadas",
         COUNT(pa.id) FILTER (WHERE pa.estado_parada != 'pendiente')::int AS "paradasResueltas"
       FROM plan_reparto p
       LEFT JOIN parada_reparto pa ON pa.plan_reparto_id = p.id
       WHERE p.distribuidor_id = $1
       GROUP BY p.id
       ORDER BY p.fecha_creacion DESC`,
      [distribuidorId]
    )
    return res.rows
  }

  // RF-045/RF-064: detalle de un reparto con sus paradas y los datos del
  // pedido de cada una (incluidas las coordenadas, para el mapa de RF-045).
  // También trae las coordenadas del depósito (distribuidor.latitud/
  // longitud, RF-042) para poder dibujar la ruta completa sobre el mapa
  // — el depósito es el punto de partida, no una parada más.
  static async obtenerDetalle(planId, distribuidorId) {
    const resPlan = await pool.query(
      `SELECT p.*, d.latitud AS deposito_latitud, d.longitud AS deposito_longitud
       FROM plan_reparto p
       JOIN distribuidor d ON d.id = p.distribuidor_id
       WHERE p.id = $1 AND p.distribuidor_id = $2`,
      [planId, distribuidorId]
    )
    if (resPlan.rows.length === 0) return null
    const plan = new PlanReparto(resPlan.rows[0])
    plan.depositoLatitud = resPlan.rows[0].deposito_latitud
    plan.depositoLongitud = resPlan.rows[0].deposito_longitud

    const resParadas = await pool.query(
      `SELECT
         pa.id, pa.orden, pa.estado_parada AS "estadoParada", pa.motivo,
         p.id AS "pedidoId", p.direccion_entrega AS "direccionEntrega",
         p.latitud, p.longitud,
         u.nombre_completo AS "nombreComprador", u.telefono AS "telefonoComprador",
         COALESCE(
           json_agg(
             json_build_object('nombreProducto', pr.nombre, 'cantidad', pi.cantidad, 'imagenUrl', pr.imagen_url)
             ORDER BY pi.id
           ) FILTER (WHERE pi.id IS NOT NULL),
           '[]'
         ) AS items
       FROM parada_reparto pa
       JOIN pedido p ON p.id = pa.pedido_id
       JOIN usuario u ON u.id = p.comprador_id
       LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
       LEFT JOIN producto pr ON pr.id = pi.producto_id
       WHERE pa.plan_reparto_id = $1
       GROUP BY pa.id, p.id, u.id
       ORDER BY pa.orden`,
      [planId]
    )

    return { plan, paradas: resParadas.rows }
  }

  // RF-064: agrega o quita pedidos de un reparto no finalizado. pedidos:
  // conjunto deseado de pedidos pendientes, filas ya validadas de
  // Pedido.listarDisponiblesRepartoDistribuidor(usuarioId, planId) — NO
  // incluye pedidos con parada ya marcada, esos quedan fijos siempre y se
  // resuelven acá contra las paradas actuales, no contra este parámetro.
  static async editarPedidos(planId, distribuidorId, pedidos, latitudPartida, longitudPartida, nombreDistribuidor) {
    const cliente = await pool.connect()
    try {
      await cliente.query('BEGIN')

      const resPlan = await cliente.query(
        `SELECT * FROM plan_reparto WHERE id = $1 AND distribuidor_id = $2 AND estado != 'finalizado' FOR UPDATE`,
        [planId, distribuidorId]
      )
      if (resPlan.rows.length === 0) {
        await cliente.query('ROLLBACK')
        return null
      }
      const plan = new PlanReparto(resPlan.rows[0])

      const resParadas = await cliente.query(
        `SELECT * FROM parada_reparto WHERE plan_reparto_id = $1`,
        [planId]
      )
      const paradasActuales = resParadas.rows.map(r => new ParadaReparto(r))
      const marcadas = paradasActuales.filter(p => p.estadoParada !== 'pendiente')
      const pendientesActuales = paradasActuales.filter(p => p.estadoParada === 'pendiente')

      const idsDeseados = new Set(pedidos.map(p => p.id))

      for (const parada of marcadas) {
        if (!idsDeseados.has(parada.pedidoId)) {
          const err = new Error('No se puede quitar una parada que ya fue marcada como Entregada, Omitida o Rechazada.')
          err.status = 409
          throw err
        }
      }

      const aQuitar = pendientesActuales.filter(p => !idsDeseados.has(p.pedidoId))
      for (const parada of aQuitar) {
        await cliente.query(`DELETE FROM parada_reparto WHERE id = $1`, [parada.id])
      }

      const idsExistentes = new Set(paradasActuales.map(p => p.pedidoId))
      const aAgregar = pedidos.filter(p => !idsExistentes.has(p.id))
      for (const pedido of aAgregar) {
        await cliente.query(
          `INSERT INTO parada_reparto (plan_reparto_id, pedido_id, orden, estado_parada)
           VALUES ($1, $2, 0, 'pendiente')`,
          [planId, pedido.id]
        )
        // Un reparto "en_curso" ya pasó por iniciar (RF-066), que puso "En
        // camino" a los pedidos que tenía en ese momento. Un pedido agregado
        // después, mientras el reparto ya está en curso, necesita el mismo
        // empujón acá mismo — si no, marcar su parada (RF-046) lo
        // encontraría todavía en "Aceptado".
        if (plan.estado === 'en_curso') {
          const resPedido = await cliente.query(
            `UPDATE pedido SET estado = 'en_camino' WHERE id = $1 RETURNING comprador_id AS "compradorId"`,
            [pedido.id]
          )
          await Notificacion.crear(
            resPedido.rows[0].compradorId, 'cambio_estado_pedido',
            Pedido.mensajeCambioEstado(nombreDistribuidor, 'en_camino'), pedido.id, cliente
          )
        }
      }

      const idsMarcados = new Set(marcadas.map(p => p.pedidoId))
      const pendientesFinales = pedidos.filter(p => !idsMarcados.has(p.id))
      // La llamada a OSRM (dentro de ordenarPorDistancia) queda dentro de
      // esta transacción a propósito: qué pedidos hay que reordenar depende
      // de lecturas que ya se hicieron acá adentro (paradasActuales,
      // marcadas), bajo el FOR UPDATE de arriba. Separar esto en un primer
      // paso de solo lectura antes de abrir la transacción duplicaría esa
      // lógica y reabriría la ventana de carrera que el FOR UPDATE evita —
      // el timeout de 5s de OSRM es aceptable acá porque es una edición de
      // un solo distribuidor sobre su propio plan, no una ruta de alta
      // concurrencia.
      const ordenados = await ordenarPorDistancia(pendientesFinales, latitudPartida, longitudPartida)
      for (let i = 0; i < ordenados.length; i++) {
        await cliente.query(
          `UPDATE parada_reparto SET orden = $1 WHERE plan_reparto_id = $2 AND pedido_id = $3`,
          [i + 1, planId, ordenados[i].id]
        )
      }

      await cliente.query('COMMIT')

      const resFinal = await cliente.query(
        `SELECT * FROM parada_reparto WHERE plan_reparto_id = $1 ORDER BY orden`,
        [planId]
      )
      return { plan, paradas: resFinal.rows.map(r => new ParadaReparto(r)) }
    } catch (error) {
      await cliente.query('ROLLBACK')
      if (error.code === '23505') {
        const err = new Error('Uno de los pedidos seleccionados ya forma parte de otro reparto.')
        err.status = 409
        throw err
      }
      throw error
    } finally {
      cliente.release()
    }
  }

  // RF-065: elimina un reparto "Sin empezar" (nunca tiene paradas
  // marcadas, porque marcar requiere haberlo iniciado primero, RF-066).
  // Un reparto "En curso" no se elimina — se cierra en bloque (RF-067);
  // el panel (RF-063) ya dirige ahí, esto es la barrera del lado del
  // servidor. No hay ON DELETE CASCADE entre parada_reparto y
  // plan_reparto (ver MER), así que las paradas (todas "pendiente" a
  // esta altura) se borran primero. Los pedidos que incluía quedan
  // libres automáticamente: al no quedar parada_reparto asociada,
  // RF-043 vuelve a listarlos como disponibles.
  static async eliminar(planId, distribuidorId) {
    const cliente = await pool.connect()
    try {
      await cliente.query('BEGIN')

      const resPlan = await cliente.query(
        `SELECT estado FROM plan_reparto WHERE id = $1 AND distribuidor_id = $2 FOR UPDATE`,
        [planId, distribuidorId]
      )
      if (resPlan.rows.length === 0) {
        await cliente.query('ROLLBACK')
        return 'no_encontrado'
      }
      if (resPlan.rows[0].estado !== 'sin_empezar') {
        await cliente.query('ROLLBACK')
        return 'no_es_sin_empezar'
      }

      await cliente.query(`DELETE FROM parada_reparto WHERE plan_reparto_id = $1`, [planId])
      await cliente.query(`DELETE FROM plan_reparto WHERE id = $1`, [planId])

      await cliente.query('COMMIT')
      return 'eliminado'
    } catch (error) {
      await cliente.query('ROLLBACK')
      throw error
    } finally {
      cliente.release()
    }
  }
}

module.exports = PlanReparto
