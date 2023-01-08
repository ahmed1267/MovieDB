const actor = require('../models/actorModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const appError = require('../utils/appError');


exports.getAllActors = factory.getAll(actor);
exports.getActor = factory.getOne(actor);
exports.createActor = factory.createOne(actor);
exports.deleteActor = factory.deleteOne(actor);
exports.updateActor = factory.updateOne(actor);