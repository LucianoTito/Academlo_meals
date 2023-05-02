const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const restaurantRouter = require('./routes/restaurant.routes');
const mealRouter = require('./routes/meal.routes');
const orderRouter = require('./routes/order.routes');

const app = express();

// Limitar el número de solicitudes
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: ' Maximum number of requests reached, please try again in one hour ',
});

// Mostrar los logs en ambiente de desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Configuraciones de seguridad
app.use(helmet()); // Configurar cabeceras HTTP
app.use(express.json()); // Permitir el uso del formato JSON
app.use(cors()); // Permitir solicitudes CORS
app.use(xss()); // Proteger contra ataques XSS
app.use(hpp()); // Proteger contra ataques de parámetros HTTP repetidos

// Limitar el número de solicitudes
app.use('/api/v1', limiter);

// RUTAS //
app.use('/api/v1/users', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/orders', orderRouter);

// Manejar solicitudes a rutas no encontradas
app.all('*', (req, res, next) => {
  return next(
    new AppError(
      `Can't find ${req.originalUrl} on this server 🚧`,
      404
    ) /*con new estoy instanciando el AppError */
  );
});

// Manejar errores
app.use(globalErrorHandler);

module.exports = app;
