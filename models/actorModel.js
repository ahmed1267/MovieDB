const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: [6, 'Actor name must have a minimum of 6 characters!'],
        maxlength: [15, 'Actor name must have a maximum of 15 characters!'],
        required: [true, 'An actor must have a name!'],
        unique: [true, 'Actor name must be unique']

    },
    movies: [{
        type: mongoose.Schema.ObjectId,
        ref: 'movie',

    }]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

actorSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'movies',
        select: '-actors -duration -durationHour -id -_id'

    });

    next();
});

const actor = mongoose.model('actor', actorSchema);
module.exports = actor;