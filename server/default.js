/**
 * @module Type.ee
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function Main($process, $env) {

    "use strict";

    // External dependencies for the Node.js server.
    var express  = require('express.io'),
        app      = express().http().io(),
        mongoose = require('mongoose');

    // Modules specific to the application.
    var session = require('./modules/session.js'),
        mongo   = require('./modules/mongo.js'),
        qr      = require('./modules/qr.js');

    // Begin Express so we can listen for the HTTP requests.
    app.use(express.static(__dirname + '/../'));
    app.listen($env.PORT || 3501);

    // User is requesting a new session.
    app.io.route('session/create', function sessionCreate(req) {

        session.createSession().then(function then(sessionId) {

            var model = mongo.createModel({ sessionId: sessionId, text: '', clients: [] });

            // Create the entry in Mongo.
            model.save(function save() {

                // Create the QR code to inherit the session.
                qr.createImage(sessionId);

                // Once the PNG has been written we'll emit the session ID.
                req.io.emit('session/id', sessionId);

            });

        });

    });

    // User is requesting the data for a given session.
    app.io.route('session/fetch', function sessionFetch(req) {

        mongo.getModel(req.data.sessionId).then(function then(model) {
            req.io.emit('session/data', model || '');
        });

    });

    // User is requesting to use a particular session ID.
    app.io.route('session/use', function sessionUse(req) {
        req.io.join(req.data.sessionId);
    });

    // User is saving the text they have typed.
    app.io.route('session/save', function sessionSave(req) {

        mongo.getModel(req.data.sessionId).then(function then(model) {

            // Asynchoronously save to the MongoDB collection.
            model.text = req.data.text;
            model.save();

            // ...And then emit to all clients who have joined the session's room.
            req.io.room(req.data.sessionId).broadcast('session/text', req.data.text);

        });

    });

})(process, process.env);