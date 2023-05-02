const express = require('express');

/* CONTROLLERS */
const authController = require('../controllers/auth.controller');

/* MIDDLEWARES */
const validations = require('../middlewares/validations.middleware');

const router = express.Router();

// Las rutas de login y registro son públicas y no necesitan autenticación
router.post('/signup', validations.createUserValidation, authController.signup);
router.post('/login', validations.loginUserValidation, authController.login);

module.exports = router;
