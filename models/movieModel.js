const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'A movie must have a name!'],
        unique: true,
        maxlength: [20, 'A movie name cannot be longer than 20 characters']
    },
    duration: {
        type: Number,
        required: [true, 'A movie must have a duration']
    },
    genre: {
        type: String,
        enum: {
            values: ['Comedy', 'Action', 'Sci-Fi', 'Drama', 'Documentry', 'Horror'],
            message: 'A movie must have a genre'
        },
        rating: Number,
        default: 4
    },
    actors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'actor'
    }]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

movieSchema.virtual('durationHour').get(function () {

    return this.duration / 60;
})

movieSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'actors',
        select: '-__v -_id -movies -movie -id'

    });

    next();
});

const movie = mongoose.model('movie', movieSchema);
module.exports = movie;