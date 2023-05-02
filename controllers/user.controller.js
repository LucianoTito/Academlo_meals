const Order = require('../models/order.model');
const Meal = require('../models/meal.model');
const Restaurant = require('../models/restaurant.model');

// "catchAsync" ayuda a manejar errores de manera asíncrona
const catchAsync = require('../utils/catchAsync');

// Encuentra todas las órdenes de un usuario en particular
exports.findUserOrders = catchAsync(async (req, res) => {
  // Obtenemos el ID del usuario del parámetro de la solicitud
  const { userId } = req.params;

  // Hacemos una consulta para encontrar todas las órdenes del usuario que tengan estado "activo"
  const orders = await Order.findAll({
    where: {
      userId,
      status: 'active',
    },
    // Incluimos información sobre la comida y el restaurante para cada orden
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
      },
      {
        model: Restaurant,
        attributes: ['name', 'address', 'rating'],
      },
    ],
  });

  // Respuesta con un estado 200 y un objeto JSON que contiene la información de las órdenes
  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

// Encuentra una orden específica de un usuario en particular
exports.getUserOrderById = catchAsync(async (req, res) => {
  // Obtenemos el ID del usuario y el ID de la orden del parámetro de la solicitud
  const { userId, orderId } = req.params;

  // Hacemos una consulta para encontrar una orden específica del usuario que tenga estado "activo"
  const order = await Order.findOne({
    where: {
      id: orderId,
      userId,
      status: 'active',
    },
    // Incluimos información sobre la comida y el restaurante para la orden
    include: [
      {
        model: Meal,
        attributes: ['name'],
      },
      {
        model: Restaurant,
        attributes: ['name'],
      },
    ],
  });

  // Si no se encuentra la orden, devolvemos una respuesta con un estado 404 y un mensaje de error
  if (!order) {
    return res.status(404).json({
      status: 'fail',
      message: 'Order not found',
    });
  }

  // Devolvemos una respuesta con un estado 200 y un objeto JSON que contiene la información de la orden
  res.status(200).json({
    status: 'success',
    order,
  });
});

exports.update = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { user } = req;

  await user.update({ name, email });
  return res.status(200).json({
    status: 'success',
    message: 'The user has been updated',
  });
});

exports.delete = catchAsync(async (req, res) => {
  const { user } = req;
  await user.update({ status: 'disabled' });
  return res.status(200).json({
    status: 'success',
    message: 'the user has been deleted',
  });
});
