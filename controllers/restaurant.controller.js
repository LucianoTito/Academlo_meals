const Restaurant = require('../models/restaurant.model');
const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');

exports.createRestaurant = catchAsync(async (req, res) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: 'success',
    restaurant,
  });
});

exports.getAllRestaurants = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: 'active',
    },
  });

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    restaurants,
  });
});

exports.getRestaurantById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findByPk(id);

  if (!restaurant || restaurant.status === 'disabled') {
    return res.status(404).json({
      status: 'fail',
      message: 'Restaurant not found',
    });
  }

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const restaurant = await Restaurant.findByPk(id);

  if (!restaurant || restaurant.status === 'disabled') {
    return res.status(404).json({
      status: 'fail',
      message: 'Restaurant not found',
    });
  }

  await restaurant.update({
    name,
    address,
  });

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.disableRestaurant = catchAsync(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findByPk(id);

  if (!restaurant || restaurant.status === 'disabled') {
    return res.status(404).json({
      status: 'fail',
      message: 'Restaurant not found',
    });
  }

  await restaurant.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// CREA UNA NUEVA RESEÑA EN EL RESTAURANT
exports.createReview = catchAsync(async (req, res) => {
  // Obtenemos el ID del restaurante del parámetro de la solicitud
  const { id } = req.params;

  // Creamos la nueva reseña utilizando la información enviada en el cuerpo de la solicitud
  const review = await Review.create({
    comment: req.body.comment,
    rating: req.body.rating,
    restaurantId: id,
    userId: req.user.id, // asumimos que tenemos la información del usuario en req.user
  });

  // Devolvemos una respuesta con un estado 201 y un objeto JSON que contiene la información de la nueva reseña
  res.status(201).json({
    status: 'success',
    review,
  });
});

//ACTUALIZA RESEÑA DE UN RESTAURANT
exports.updateReview = catchAsync(async (req, res) => {
  // Obtenemos los IDs del restaurante y de la reseña del parámetro de la solicitud
  const { restaurantId, id } = req.params;

  // Buscamos la reseña que queremos actualizar
  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
    },
  });

  // Si no se encuentra la reseña, devolvemos una respuesta con un estado 404 y un mensaje de error
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }

  // Verificamos que el autor de la reseña sea quien esté intentando actualizarla
  if (req.user.id !== review.userId) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to update this review',
    });
  }

  // Actualizamos la reseña utilizando la información enviada en el cuerpo de la solicitud
  review.comment = req.body.comment;
  review.rating = req.body.rating;
  await review.save();

  // Devolvemos una respuesta con un estado 200 y un objeto JSON que contiene la información de la reseña actualizada
  res.status(200).json({
    status: 'success',
    review,
  });
});

// ACTUALIZA UNA RESEÑA HECHA EN UN RESTAURANT A STATUS DELETED
exports.deleteReview = catchAsync(async (req, res) => {
  // Obtenemos los IDs del restaurante y de la reseña del parámetro de la solicitud
  const { restaurantId, id } = req.params;

  // Buscamos la reseña que queremos eliminar
  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
    },
  });

  // Si no se encuentra la reseña, devolvemos una respuesta con un estado 404 y un mensaje de error
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }

  // Verificamos que el usuario que está haciendo la solicitud sea el autor de la reseña
  if (review.userId !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to perform this action',
    });
  }

  // Actualizamos el estado de la reseña a "deleted"
  review.status = 'deleted';
  await review.save();

  // Devolvemos una respuesta con un estado 204 y sin contenido
  res.status(204).send();
});
