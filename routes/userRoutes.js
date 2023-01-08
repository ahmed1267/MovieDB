const express = require('express');
const user = require('../models/userModel');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/', authController.protect, userController.getAllUsers);
router.get('/:id', authController.protect, userController.getUser);
module.exports = router;