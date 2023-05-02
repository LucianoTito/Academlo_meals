const AppError = require('../utils/appError');

// Función para generar error de tipo de datos
const handleCastError = () => {
  return new AppError('Invalid data type sent', 400);
};

// Función para manejar el error de token expirado
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired, please log in again', 401);
};

// Función para manejar el error de token inválido
const handleJWTError = () => {
  return new AppError('Invalid token, please login again', 401);
};

// Función para enviar errores en fase de desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Función para enviar errores en fase de producción
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

// Función de middleware para manejar errores globales
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;

    // Manejar errores de tipo de datos relacionados con la base de datos
    if (error.parent?.code === '22P02') {
      error = handleCastError();
    }

    // Manejar errores de token expirado
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    // Manejar errores de token inválido
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
