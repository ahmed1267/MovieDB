const express = require('express');
const movie = require('../models/movieModel');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authController = require('./../controllers/authController');

router
    .route('/')
    .get(movieController.getAllMovies)
    .post(authController.protect, movieController.createMovie);


router
    .route('/:id')
    .get(movieController.getMovie)
    .patch(authController.protect, movieController.updateMovie)
    .delete(movieController.deleteMovie);

module.exports = router;