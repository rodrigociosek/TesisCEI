const express = require('express')
const { verificarToken } = require('../middleware/autenticacion')
const reportesController = require('../controllers/reportesController')

const router = express.Router()

router.get('/rendimiento', verificarToken, reportesController.obtenerRendimiento)
router.get('/rentabilidad', verificarToken, reportesController.obtenerRentabilidad)

module.exports = router
