const movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const appError = require('../utils/appError');


exports.getAllMovies = factory.getAll(movie);
exports.getMovie = factory.getOne(movie);
exports.createMovie = factory.createOne(movie);
exports.deleteMovie = factory.deleteOne(movie);
exports.updateMovie = factory.updateOne(movie);