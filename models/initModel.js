const Restaurant = require('./restaurant.model');
const Meal = require('./meal.model');
const Review = require('./review.model');
const User = require('./user.model');
const Order = require('./order.model');

const initModel = () => {
  //  Relación: Un restaurante puede tener muchos meals
  //  1 Restaurant <-----> N Meal
  Restaurant.hasMany(Meal, { foreignKey: 'restaurantId' });
  Meal.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

  // 1 Restaurant <----> N Review
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  // 1 User <----> N Review
  User.hasMany(Review);
  Review.belongsTo(User);

  // 1 User <----> N Order
  User.hasMany(Order);
  Order.belongsTo(User);

  // 1 Meal <----> 1 Order
  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = initModel;
