const express = require('express');

/*CONTROLLERS */
const mealController = require('../controllers/meal.controller');

/*MIDDLEWARES */
const mealMiddleware = require('../middlewares/meal.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/').get(mealController.getAllMeals);
router
  .route('/:id')
  .post(
    authMiddleware.protect,
    mealMiddleware.createMealValidation,
    authMiddleware.restrictTo('admin'),
    mealController.createMeal
  )
  .get(mealController.getMealById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    mealController.updateMeal
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    mealController.disableMeal
  );

module.exports = router;
