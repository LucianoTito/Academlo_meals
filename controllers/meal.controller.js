const Meal = require('../models/meal.model');
const catchAsync = require('../utils/catchAsync');

//CREA UNA NUEVA COMIDA EN EL RESTAURANT
exports.createMeal = catchAsync(async (req, res) => {
  //Obtenemos los valores que nos envían en el body de la petición
  const { name, price } = req.body;
  //Obtenemos el id del restaurante en el cual se creará la comida, que viene en la URL de la petición
  const { id } = req.params;

  //Creamos una nueva instancia de la comida y la guardamos en la base de datos
  const meal = await Meal.create({
    name,
    price,
    restaurantId: id, //Guardamos el id del restaurante como clave foránea en la tabla de meals
  });

  //Enviamos una respuesta con el objeto creado y un mensaje de éxito
  res.status(201).json({
    status: 'success',
    meal,
  });
});

// OBTENER TODAS LAS COMIDAS CON ESTADO ACTIVE, incluyendo información del restaurante
exports.getAllMeals = catchAsync(async (req, res) => {
  const meals = await Meal.findAll({
    where: {
      status: 'active',
    },
    include: {
      model: Restaurant,
      attributes: ['name', 'address', 'rating'],
    },
  });

  res.status(200).json({
    status: 'success',
    results: meals.length,
    meals,
  });
});

// OBTENER UNA COMIDA POR ID CON ESTADO ACTIVO, incluyendo información del restaurante
exports.getMealById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
    include: {
      model: Restaurant,
      attributes: ['name', 'address', 'rating'],
    },
  });

  if (!meal) {
    return res.status(404).json({
      status: 'fail',
      message: 'Meal not found',
    });
  }

  res.status(200).json({
    status: 'success',
    meal,
  });
});

//ACTUALIZAR COMIDA (NAME, PRICE)
exports.updateMeal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!meal) {
    return res.status(404).json({
      status: 'fail',
      message: 'Meal not found',
    });
  }

  await meal.update({
    name,
    price,
  });

  res.status(200).json({
    status: 'success',
    meal,
  });
});
//DESHABILITAR COMIDA
exports.disableMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!meal) {
    return res.status(404).json({
      status: 'fail',
      message: 'Meal not found',
    });
  }

  await meal.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
