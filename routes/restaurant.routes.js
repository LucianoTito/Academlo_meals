const express = require('express');

/*CONTROLLERS */
const restaurantController = require('../controllers/restaurant.controller');

/*MIDDLEWARES */
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    restaurantMiddleware.createRestaurantValidation,
    authMiddleware.restrictTo('admin'),
    restaurantController.createRestaurant
  )
  .get(restaurantController.getAllRestaurants);

router
  .route('/:id')
  .get(restaurantController.getRestaurantById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.updateRestaurant
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.disableRestaurant
  );
router
  .route('/reviews/:id')
  .post(authMiddleware.protect, restaurantController.createReview);
router
  .route('/reviews/restaurantId/:id')
  .use(authMiddleware.protect)
  .patch(restaurantController.updateReview)
  .delete(restaurantController.deleteReview);

module.exports = router;
