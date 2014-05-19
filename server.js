/**
 * @module Type.ee
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function($process) {

    "use strict";

    var express     = require('express'),
        app         = express(),
        server      = require('http').createServer(app),
        io          = require('socket.io').listen(server),
        redis       = require('redis'),
        client      = redis.createClient(),
        crypto      = require('crypto'),
        q           = require('q'),
        yaml        = require('yamljs'),
        Encoder     = require('qr').Encoder,
        encoder     = new Encoder;

    // Begin Express so the statistics are available from the `localPort`.
    app.use(express.static(__dirname));
    server.listen($process.env.PORT || 3501);

    io.sockets.on('connection', function connection(socket) {

        /**
         * @method createSession
         * @return {q.promise}
         */
        var createSession = function createSession() {

            var deferred = q.defer();

            crypto.randomBytes(256, function(error, buffer) {

                if (error) {
                    throw error;
                }

                // Generate a SHA256 string from the random bytes.
                var sessionId = crypto.createHash('sha256').update(buffer).digest('hex');
                deferred.resolve(sessionId);

            });

            return deferred.promise;

        };

        // Establish a new session.
        socket.on('session/create', function sessionCreate() {

            createSession().then(function then(sessionId) {

                var config = yaml.load('config.yml');

                // Create the QR code to inherit the session.
                var data = config.website_url + '#?session=' + sessionId;
                encoder.encode(data, __dirname + '/images/' + sessionId + '.png');

                encoder.on('end', function() {

                    // Once the PNG has been written we'll emit the session ID.
                    socket.emit('session/id', sessionId);

                });


            });

        });

        // When the session needs to be retrieved.
        socket.on('session/fetch', function sessionFetch(params) {

            client.hget('type', params.sessionId, function(error, text) {
                socket.emit('session/text', text || '');
            });

        });

        // When the client has requested to use a particular session.
        socket.on('session/use', function sessionUse(sessionId) {
            socket.join(sessionId);
        });

        // When the text has been pushed.
        socket.on('session/save', function sessionSave(params) {
            client.hset('type', params.sessionId, params.text);
            socket.broadcast.to(params.sessionId).emit('session/text', params.text);
        });

    });

})(process);