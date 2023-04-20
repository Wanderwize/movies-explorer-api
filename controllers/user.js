const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const NotUniqueError = require('../errors/NotUniqueError');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findOneAndUpdate(
    { _id: userId, email: { $ne: email } },
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotUniqueError('Необходимо изменить Email'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.code === 11000) {
        next(new NotUniqueError('Email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
        return;
      }
      if (err.code === 11000) {
        next(new NotUniqueError('Пользователь уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
