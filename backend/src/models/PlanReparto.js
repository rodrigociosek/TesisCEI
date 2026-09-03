const pool = require('../config/db')

class PlanReparto {
  constructor(data) {
    this.id = data.id
    this.distribuidorId = data.distribuidor_id
    this.estado = data.estado
    this.fechaCreacion = data.fecha_creacion
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
}

module.exports = PlanReparto
