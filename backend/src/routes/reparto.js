const express = require('express')
const { verificarToken } = require('../middleware/autenticacion')
const repartoController = require('../controllers/repartoController')

const router = express.Router()

router.get('/planes', verificarToken, repartoController.listarPlanes)

module.exports = router
