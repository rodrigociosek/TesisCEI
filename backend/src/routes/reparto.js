const express = require('express')
const { verificarToken } = require('../middleware/autenticacion')
const repartoController = require('../controllers/repartoController')

const router = express.Router()

router.post('/generar', verificarToken, repartoController.generarPlan)
router.get('/planes', verificarToken, repartoController.listarPlanes)
router.get('/:id', verificarToken, repartoController.obtenerDetalle)
router.put('/:id/pedidos', verificarToken, repartoController.editarPedidos)
router.delete('/:id', verificarToken, repartoController.eliminar)
router.post('/:id/iniciar', verificarToken, repartoController.iniciar)
router.post('/:id/cerrar-en-bloque', verificarToken, repartoController.cerrarEnBloque)
router.post('/:id/paradas/:paradaId/marcar', verificarToken, repartoController.marcarParada)

module.exports = router
