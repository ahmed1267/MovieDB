const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const { deleteOne, findById, findByIdAndUpdate } = require('../models/movieModel');
const { json } = require('express');
const APIFeatures = require('../utils/apiFeatures');
const { Model } = require('mongoose');
const movie = require('../models/movieModel');
const actor = require('../models/actorModel');


const checkActor = async (doc, body) => {

    const addedActor = await actor.findById(body.actors[0])
    console.log(addedActor.name)
    doc.actors.forEach(actor => {
        console.log(actor.name)
        if (addedActor.name === actor.name) {
            return false;
            // res.status(401).json({
            //     status: 'Fail'
            // })
        } else { return true }
    })
    // const keys = Object.keys(body);
    // let keyNum = 0;
    // keys.forEach(async function (key) {
    //     keyNum = +1
    //     if (key === 'actors') {


    //         const actorName = Object.values(actor.findById(Object.values(body)[keyNum]))[0]
    //         const found = await movie.aggregate([
    //             {
    //                 $match: {
    //                     $and: [
    //                         { name: movieName },
    //                         { actors: actorName }
    //                     ]
    //                 }
    //             }
    //         ])

    //         if (!found) {
    //             next()
    //         }

    //         return next(new appError('This actor is already added to this movie', 401))
    //     }
    // })
    // const ids = Object.values(body);
    // //console.log(ids);
    // await keys.forEach(function (key) {
    //     if (key === 'actors') {

    //         ids.forEach(function (id) {
    //             //console.log(id)
    //             //let currentActor = actor.findById(id)
    //             // console.log(Object.values(currentActor).find(value => currentActor[value] === name))
    //             // console.log(currentActor)
    //             doc.actors.forEach(function (currentMovieActorId) {
    //                 if (id === currentMovieActorId.toString()) {
    //                     return next(new appError('This actor is already added', 401))
    //                 }
    //             })
    //         })
    //     }
    // })

}

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {

        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new appError('No document found with this ID', 404));
        }

        res.status(204).json({
            status: 'Success',
            data: null
        });

    });


exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {


        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

            const doc = await Model.findByIdAndUpdate(req.params.id, req.body)

        } else { return next(new appError('This is not a suitable Id', 401)) }



        if (!doc) {
            return next(new appError('No document found with this ID', 404));
        }


        res.status(200).json({
            status: 'Success',
            data: doc
        });

    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)
        console.log(doc.name)
        console.log(doc.actors)
        res.status(200).json({
            status: 'Success',
            data: doc
        });
    })

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        // const doc = await Model.find();


        let filter = {};
        console.log(filter)
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()


        const doc = await features.query;

        res.status(200).json({
            status: 'Success',
            results: doc.length,
            data: doc
        });

    });

exports.getOne = Model =>
    catchAsync(async (req, res, next) => {

        let data
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            data = await Model.findById(req.params.id);

        } else { return next(new appError('This is not a suitable Id', 401)) }

        if (!data) { return next(new appError('No document with this id', 404)) }

        res.status(200).json({
            status: 'Success',
            data
        })
    })

exports.updateMovie = () =>
    catchAsync(async (req, res, next) => {

        let doc

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

            doc = await movie.findById(req.params.id)

        } else { return next(new appError('This is not a suitable Id', 401)) }

        if (!doc) { return next(new appError('No Movie with this Id', 404)) }

        console.log(req.body.actors)
        if (req.body.actors) {

            const actorCheck = await checkActor(doc, req.body)
            console.log(actorCheck)

            if (actorCheck === false) { return next(new appError('This actor is already added to this movie', 401)) }

            await movie.updateOne({ _id: req.params.id }, { $push: req.body.actors })
        }

        res.status(200).json({
            status: 'Success',
            data: doc
        })

    })