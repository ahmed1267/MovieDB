const dotenv = require('dotenv');
const app = require('./app.js');
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', encodeURIComponent(process.env.DATABASE_PASSWORD));

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB connection successful!'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is up on ${port}..`)
})