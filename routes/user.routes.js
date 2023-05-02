const express = require('express');

/*CONTROLLERS */
const userController = require('../controllers/user.controller');

/*MIDDLEWARES */
const validationMiddleware = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/*Todas las rutas que se ejecuten debajo de router.use() van a estar protegidas */
router.use(authMiddleware.protect);

router
  .route('/:id')
  .patch(
    authMiddleware.restrictTo('normal'),
    validationMiddleware.updateUserValidation,
    authMiddleware.protectAccountOwner,
    userController.update
  )
  .delete(
    authMiddleware.restrictTo('normal'),
    authMiddleware.protectAccountOwner,
    userController.delete
  );

router.get('/orders', userController.findUserOrders);

router.get('/orders/:id', userController.getUserOrderById);

module.exports = router;
