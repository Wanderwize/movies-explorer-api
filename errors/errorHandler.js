const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode === 500 ? 'На сервере произошла ошибка3' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
