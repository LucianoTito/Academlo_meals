const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  //1. Tomar la información de la req.body
  const { name, email, password, role } = req.body;

  //2. Verificar si el usuario ya existe
  const existingUser = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (existingUser) {
    return next(new AppError('Email already exists', 400));
  }

  //3. Codificar la contraseña del usuario
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  //4. Crear un nuevo usuario en la base de datos
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  //5. Generar un token de autenticación para el nuevo usuario
  const token = await generateJWT(newUser.id);

  //6. Enviar la respuesta al cliente
  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1.Traernos la información de la req.body
  const { email, password } = req.body;
  //2. Buscar el  usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });
  //3.Validar si la contraseña es correcta
  if (!user) {
    return next(new AppError('User could not be found', 404));
  }

  // 5. Comparar las contraseñas
  if (!(await bcrypt.compare(password, user.password))) {
    return next(
      new AppError('The email or password you entered is incorrect', 401)
    );
  }

  //6. Si todo está correcto, generar el jsonWebToken
  const token = await generateJWT(user.id);

  //7. Enviar la respuesta al cliente
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
