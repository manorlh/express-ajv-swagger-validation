'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var inputValidation = require('../../src/middleware');

var inputValidationOptions = {
    formats: [
        { name: 'double', pattern: /\d+(\.\d+)?/ },
        { name: 'int64', pattern: /^\d{1,19}$/ },
        { name: 'int32', pattern: /^\d{1,10}$/ }
    ],
    beautifyErrors: true,
    firstError: true
};

module.exports = inputValidation.init('test/pet-store-swagger-inheritance.yaml', inputValidationOptions)
    .then(function () {
        var app = express();
        app.use(bodyParser.json());
        app.get('/pets', inputValidation.validate, function (req, res, next) {
            res.json({ result: 'OK' });
        });
        app.post('/pets', inputValidation.validate, function (req, res, next) {
            res.json({ result: 'OK' });
        });
        app.get('/:version/pets/:petId', inputValidation.validate, function (req, res, next) {
            res.json({ result: 'OK' });
        });
        app.put('/pets', inputValidation.validate, function (req, res, next) {
            res.json({ result: 'OK' });
        });
        app.use(function (err, req, res, next) {
            if (err instanceof inputValidation.InputValidationError) {
                res.status(400).json({ more_info: JSON.stringify(err.errors) });
            }
        });

        return Promise.resolve(app);
    });
