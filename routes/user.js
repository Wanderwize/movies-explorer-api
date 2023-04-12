const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/user');

userRouter.get('/users/me', auth, getCurrentUser);

userRouter.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = userRouter;
