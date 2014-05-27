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
        yaml     = require('yamljs'),
        mongoose = require('mongoose'),
        qr       = require('qr-image');

    // Connect to MongoDB, and create the model for the text entry.
    mongoose.connect('mongodb://localhost/type-ee');
    var Text = mongoose.model('Text', { sessionId: String, text: String, clients: Array });

    // Modules specific to the application.
    var session = require('./modules/session.js');

    // Begin Express so we can listen for the HTTP requests.
    app.use(express.static(__dirname + '/../'));
    app.listen($env.PORT || 3501);

    // User is requesting a new session.
    app.io.route('session/create', function sessionCreate(req) {

        session.createSession().then(function then(sessionId) {

            var config = yaml.load('config.yml'),
                model  = new Text({ sessionId: sessionId, text: '', clients: [] });

            // Create the entry in Mongo.
            model.save(function save(error) {

                if (error) {

                    // We discovered an error!
                    throw error;

                }

                // Create the QR code to inherit the session.
                var data  = config.website_url + '#?session=' + sessionId,
                    pngQr = qr.image(data, { type: 'png' });
                pngQr.pipe(require('fs').createWriteStream(__dirname + '/../images/' + sessionId + '.png'));

                // Once the PNG has been written we'll emit the session ID.
                req.io.emit('session/id', sessionId);

            });

        });

    });

    // User is requesting the data for a given session.
    app.io.route('session/fetch', function sessionFetch(req) {

        Text.findOne({ sessionId: req.data.sessionId }, function findText(error, model) {
            req.io.emit('session/data', model || '');
        });

    });

    // User is requesting to use a particular session ID.
    app.io.route('session/use', function sessionUse(req) {
        req.io.join(req.data.sessionId);
    });

    // User is saving the text they have typed.
    app.io.route('session/save', function sessionSave(req) {

        Text.findOne({ sessionId: req.data.sessionId }, function findText(error, model) {

            model.text = req.data.text;
            model.save();

            req.io.room(req.data.sessionId).broadcast('session/text', req.data.text);

        });

    });

})(process, process.env);