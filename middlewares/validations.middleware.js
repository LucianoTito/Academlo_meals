// Importa los métodos necesarios de express-validator para validar los datos de entrada de las solicitudes
const { body } = require('express-validator');
const { validationResult } = require('express-validator');

// Define un middleware para validar los campos enviados en las solicitudes
exports.validateFields = (req, res, next) => {
  // Verifica si hay errores de validación utilizando la función validationResult
  const errors = validationResult(req);

  // Si hay errores, devuelve una respuesta con un código de estado 400 y una lista de errores
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  // Si no hay errores, llama al siguiente middleware
  next();
};

// Define un middleware para validar los datos de entrada de la solicitud de creación de usuario
exports.createUserValidation = [
  // Utiliza el método body para validar los campos de la solicitud y agregar mensajes de error personalizados
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8, max: 16 })
    .withMessage('The password must be between 8 and 16 characters'),

  // Agrega el middleware de validación de campos al final de la lista de validaciones
  this.validateFields,
];

// Define un middleware para validar los datos de entrada de la solicitud de actualización de usuario
exports.updateUserValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),

  // Agrega el middleware de validación de campos al final de la lista de validaciones
  this.validateFields,
];

// Define un middleware para validar los datos de entrada de la solicitud de inicio de sesión de usuario
exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('The password cannot be empty')
    .isLength({ min: 8, max: 16 })
    .withMessage('The password must be between 8 and 16 characters'),

  // Agrega el middleware de validación de campos al final de la lista de validaciones
  this.validateFields,
];

// Define un middleware para validar los datos de entrada de la solicitud de actualización de contraseña de usuario
exports.updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('The password cannot be empty')
    .isLength({ min: 8, max: 16 })
    .withMessage('The password must be between 8 and 16 characters'),
  body('newPassword')
    .notEmpty()
    .withMessage('The password cannot be empty')
    .isLength({ min: 8, max: 16 })
    .withMessage('The password must be between 8 and 16 characters'),

  // Agrega el middleware de validación de campos al final de la lista de validaciones
  this.validateFields,
];
