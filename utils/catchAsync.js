/*LOGICA DE LOS ERRORES */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(
      next
    ) /*la linea 7 consume el error y lo está enviando (el next es como un transportista) */;
  };
};

module.exports = catchAsync;
