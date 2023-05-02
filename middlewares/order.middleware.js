const { body } = require('express-validator');
const { validationResult } = require('express-validator');

exports.validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createOrderValidation = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),

  this.validateFields,
];
