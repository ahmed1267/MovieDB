const mongoose = require("mongoose");
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: [6, 'User name must have a minimum of 6 characters!'],
        maxlength: [15, 'User name must have a maximum of 15 characters!'],
        required: [true, 'A user must have a name!']


    },
    username: {
        type: String,
        minlength: [4, 'Username must have a minimum of 4 characters!'],
        maxlength: [15, 'Username must have a maximum of 15 characters!'],
        required: [true, 'A user must have a username!'],
        unique: [true, 'This username is taken!']

    },
    password: {
        type: String,
        required: [true, 'a user must have a password'],
        minlength: [8, 'Password cannot be less than 8 characters!'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
    },

    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            default: 'user'
        },

    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {

    return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model('user', userSchema);
module.exports = user;