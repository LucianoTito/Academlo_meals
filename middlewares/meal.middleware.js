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

// Define un middleware para validar los datos de entrada de la solicitud de creación de una comida
exports.createMealValidation = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  //Esto nos va a asegurar de que se creen comidas con un precio de 0 o un precio negativo.
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a number greater than 0'),

  this.validateFields,
];
