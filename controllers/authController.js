const user = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('./../utils/appError');
const { promisify } = require('util');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true
    };

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user
        }
    });
};


exports.signup =
    catchAsync(async (req, res, next) => {

        const newUser = await user.create({
            name: req.body.name,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            username: req.body.username
        });


        createSendToken(newUser, 201, res);
        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        // res.status(201).json({
        //     status: 'Success',
        //     token,
        //     data: {
        //         user: newUser
        //     }
        // })
    });

exports.login =
    catchAsync(async (req, res, next) => {

        const { username, password } = req.body;

        if (!username || !password) {
            return next(new appError('Please provide your username and password!', 400));
        }

        const currentUser = await user.findOne({ username }).select('+password');


        if (!currentUser || !(await currentUser.correctPassword(password, currentUser.password))) {
            return next(new appError('Incorrect username or password', 401));
        }

        createSendToken(currentUser, 201, res);
        // const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET);

        // res.status(200).json({
        //     status: 'Success',
        //     token,
        // })
    })

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new appError('You are not logged in!', 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    next();
})