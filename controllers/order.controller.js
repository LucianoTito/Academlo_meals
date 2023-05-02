const Order = require('../models/order.model');
const Meal = require('../models/meal.model');
const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// CREA UNA NUEVA ORDEN
exports.createOrder = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;
  const userId = req.user.id; // Obtenemos el ID del usuario desde el token de autenticación

  // Buscamos la comida en la base de datos
  const meal = await Meal.findByPk(mealId);

  // Si no se encuentra la comida se envía un error.
  if (!meal) {
    return next(new AppError('The food does not exist.', 404));
  }

  // Calculamos el precio de la orden
  const price = meal.price * quantity;

  // Creamos la nueva orden
  const order = await Order.create({
    mealId,
    userId,
    totalPrice: price,
    quantity,
  });

  // Enviamos la respuesta
  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// OBTIENE TODAS LAS ORDENES DEL USUARIO
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Obtenemos el ID del usuario desde el token de autenticación

  // Buscamos todas las órdenes del usuario en la base de datos
  const orders = await Order.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Meal,
        attributes: ['id', 'name', 'price'],
        include: [
          {
            model: Restaurant,
            attributes: ['id', 'name', 'address', 'rating'],
          },
        ],
      },
    ],
  });

  // Enviamos la respuesta
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

//MARCAR UNA ORDEN POR ID CON STATUS COMPLETED
exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  // Buscar la orden
  const order = await Order.findOne({
    where: {
      id,
      userId,
      status: 'active',
    },
  });

  // Si no se encuentra la orden, enviar un error
  if (!order) {
    return next(new AppError('The order was not found.', 404));
  }

  // Marcar la orden como completada
  order.status = 'completed';
  await order.save();

  // Enviar la respuesta con la orden actualizada
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// MARCAR UNA ORDEN POR ID CON STATUS CANCELLED
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  // Buscar la orden
  const order = await Order.findOne({
    where: {
      id,
      userId,
      status: 'active',
    },
  });

  // Si no se encuentra la orden, enviar un error
  if (!order) {
    return next(new AppError('The order was not found.', 404));
  }

  // Marcar la orden como cancelada
  order.status = 'cancelled';
  await order.save();

  // Enviar la respuesta con la orden actualizada
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});
