const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const { deleteOne, findById } = require('../models/movieModel');
const { json } = require('express');
const APIFeatures = require('../utils/apiFeatures');
const { Model } = require('mongoose');

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
        console.log(req.body);
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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
        // .catch(err => {
        //     return (new appError(err.message.toString(), 500));

        // });

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


        const data = await Model.findById(req.params.id);


        res.status(200).json({
            status: 'Success',
            data
        })
    })