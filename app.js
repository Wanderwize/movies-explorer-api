require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const NotFoundError = require('./errors/notFoundError');
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/moviedb', {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(userRouter);
app.use(movieRouter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);
app.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});

module.exports = app;
