const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

// Middleware para proteger rutas, asegurando que solo usuarios autenticados puedan acceder a ellas.
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Extraer el token de autorización de la solicitud
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Validar si existe el token
  if (!token) {
    return next(
      new AppError('You are not logged in!, Please log in to get access', 401)
    );
  }

  // 3. Decodificar el token JWT para obtener los datos del usuario
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  // 4. Buscar el usuario en la base de datos usando el ID almacenado en el token
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  // Si el usuario no existe, retornar un error.
  if (!user) {
    return next(
      new AppError('The owner of this token it not longer avaiable', 401)
    );
  }

  // Verificar si el usuario cambió su contraseña después de emitir el token.
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password, please login again', 401)
      );
    }
  }

  // Si todo está bien, almacenar el usuario en la solicitud para su uso en la próxima middleware.
  req.sessionUser = user;
  next();
});

// Middleware para proteger rutas donde se requiere que el usuario sea el propietario de una cuenta en particular
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  // Comparar el ID del usuario almacenado en la sesión con el ID del usuario que se intenta modificar.
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id) {
    return next(new AppError('You are not the owner of this account', 401));
  }
  next();
});

// Middleware para restringir el acceso solo a ciertos roles de usuario
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Verificar si el rol del usuario en sesión está incluido en los roles permitidos.
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action.!', 403)
      );
    }

    // Si todo está bien, permitir el acceso a la ruta.
    next();
  };
};
