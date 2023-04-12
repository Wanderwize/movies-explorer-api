const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const regEx = require('../utils/regex');
const { getMovies, deleteMovie, createMovie } = require('../controllers/movie');

movieRouter.get('/movies', auth, getMovies);

movieRouter.post(
  '/movies',
  auth,
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regEx.link),
      trailerLink: Joi.string().required().pattern(regEx.link),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(regEx.link),
    }),
  }),
  createMovie
);

movieRouter.delete(
  '/movies/:movieId',
  auth,
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),

  deleteMovie
);

module.exports = movieRouter;
