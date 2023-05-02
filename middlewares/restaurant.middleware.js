const { body } = require('express-validator');
const { validationResult } = require('express-validator');

/// Define un middleware para validar los campos enviados en las solicitudes
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

// Validar los datos de entrada de la solicitud de creación de un restaurant
exports.createRestaurantValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),

  body('address').notEmpty().withMessage('address cannot be empty'),

  body('rating')
    .notEmpty()
    .withMessage('Rating cannot be empty')
    .isIn([1, 2, 3, 4, 5])
    .withMessage('Rating must be a number between 1 and 5'),

  this.validateFields,
];
