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
//        client      = redis.createClient(),
        crypto      = require('crypto'),
        q           = require('q');

    // Begin Express so the statistics are available from the `localPort`.
    app.use(express.static(__dirname));
    server.listen($process.env.PORT || 3501);

    /**
     * @method generateSessionId
     * @return {q.promise}
     */
    var generateSessionId = function generateSessionId() {

        var deferred = q.defer();

        crypto.randomBytes(256, function(ex, buf) {

            // Generate a SHA256 string from the random bytes.
            var sessionId = crypto.createHash('sha256').update(buf).digest('hex');
            deferred.resolve(sessionId);

        });

        return deferred.promise;

    };

    io.sockets.on('connection', function connection(socket) {

        generateSessionId().then(function then(sessionId) {

            // Emit the session ID that the user will use.
            socket.emit('connection/session/id', sessionId);

        });

    });

})(process);