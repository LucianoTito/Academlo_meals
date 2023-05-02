class AppError extends Error {
  // Definimos la clase en donde manejaremos el error
  constructor(message, statusCode) {
    // Creamos el método constructor, en donde recibe un mensaje y un código de estado
    super(message); // Con el super le decimos "ejecútate y por parámetro le enviamos el mensaje"

    this.statusCode = statusCode; // this.statusCode es una propiedad de la clase de Error y se asigna el valor recibido como argumento
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail'; // Si el código de estado comienza con 4 es un error, de lo contrario es un fail
    this.isOperational = true; // Esta propiedad se usa para identificar errores operacionales en la aplicación

    Error.captureStackTrace(this, this.constructor); // Captura el error y muestra la pila de llamadas en la consola
  }
}

module.exports = AppError; // Exportamos la clase para que pueda ser utilizada en otros archivos
