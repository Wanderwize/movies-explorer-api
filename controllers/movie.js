const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const NotEnoughRightsError = require('../errors/NotEnoughRightsError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err, movie) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при добавлении фильма'));
        console.log(err);
        console.log(movie);
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)

    .orFail(new NotFoundError('Карточка не найдена'))
    .then((movie) => {
      const user = req.user._id;
      const owner = movie.owner._id.toString();

      if (user === owner) {
        return Movie.deleteOne(movie).then(() => res.send(movie));
      }
      return next(new NotEnoughRightsError('Недостаточно прав'));
    })
    .catch(next);
};
