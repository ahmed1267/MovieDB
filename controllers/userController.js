const user = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const appError = require('../utils/appError');

exports.getAllUsers = factory.getAll(user);
exports.getUser = factory.getOne(user);