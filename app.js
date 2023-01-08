const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const appError = require('./utils/appError');
const movieRouter = require('./routes/movieRoutes');
const userRouter = require('./routes/userRoutes');
const actorRouter = require('./routes/actorRoutes');


const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Middleware');
    next();
});

app.use((req, res, next) => {
    console.log(Date.now());
    next();
});

app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/actor', actorRouter)

app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;

