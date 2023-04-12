const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: { type: String, required: true },

  duration: { type: Number, required: true },

  year: { type: String, required: true },

  description: { type: String, required: true },

  image: { type: String, required: true },

  trailerLink: { type: String, required: true },

  thumbnail: { type: String, required: true },

  owner: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' },

  // movieId: { required: true, type: Number },

  nameRU: { type: String, required: true },

  nameEN: { type: String, required: true },
});

movieSchema.path('trailerLink').validate((trailerLink) => {
  const urlRegex =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(trailerLink);
}, 'Ошибка валидации');

movieSchema.path('image').validate((image) => {
  const urlRegex =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(image);
}, 'Ошибка валидации');

movieSchema.path('thumbnail').validate((thumbnail) => {
  const urlRegex =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(thumbnail);
}, 'Ошибка валидации');

module.exports = mongoose.model('movie', movieSchema);
