const express = require('express');
const actor = require('../models/actorModel');
const router = express.Router();
const actorController = require('../controllers/actorController');
const authController = require('./../controllers/authController');

router
    .route('/')
    .get(actorController.getAllActors)
    .post(authController.protect, actorController.createActor);


router
    .route('/:id')
    .get(actorController.getActor)
    .patch(authController.protect, actorController.updateActor)
    .delete(authController.protect, actorController.deleteActor);

module.exports = router;