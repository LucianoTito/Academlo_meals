const express = require('express');

/*CONTROLLERS */
const orderController = require('../controllers/order.controller');

/*MIDDLEWARES */
const authMiddleware = require('../middlewares/auth.middleware');
const orderMiddleware = require('../middlewares/order.middleware');

const router = express.Router();

/*Todas las rutas que se ejecuten debajo de router.use() van a estar protegidas */
router.use(authMiddleware.protect);

router
  .route('/')
  .post(orderMiddleware.createOrderValidation, orderController.createOrder);

router.route('/me').get(orderController.getMyOrders);

router
  .route('/:id')
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
