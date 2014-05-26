/**
 * @module Type.ee
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function($process, $environment) {

    "use strict";

    var express = require('express.io'),
        redis   = require('redis'),
        app     = express().http().io(),
        yaml    = require('yamljs'),
        qr      = require('qr-image'),
        q       = require('q'),
        crypto  = require('crypto'),
        client  = {};

    // Create the Redis client.
    if ($environment.REDISTOGO_URL) {

        // Client for Heroku.
        var rtg = require('url').parse(process.env.REDISTOGO_URL);
        client  = redis.createClient(rtg.port, rtg.hostname);
        client.auth(rtg.auth.split(':')[1]);

    } else {

        // Client for development.
        client = redis.createClient();

    }

    // Begin Express so we can listen for the HTTP requests.
    app.use(express.static(__dirname));
    app.listen($process.env.PORT || 3501);

    /**
     * @method createSession
     * @return {Q.promise}
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

    // User is requesting a new session.
    app.io.route('session/create', function(req) {

        createSession().then(function then(sessionId) {

            var config = yaml.load('config.yml');

            // Create the QR code to inherit the session.
            var data  = config.website_url + '#?session=' + sessionId,
                pngQr = qr.image(data, { type: 'png' });
            pngQr.pipe(require('fs').createWriteStream(__dirname + '/images/' + sessionId + '.png'));

            // Once the PNG has been written we'll emit the session ID.
            req.io.emit('session/id', sessionId);

        });

    });

    // User is requesting the data for a given session.
    app.io.route('session/fetch', function sessionFetch(req) {

        client.hget('type', params.sessionId, function(error, text) {
            req.io.emit('session/text', text || '');
        });

    });

    // User is requesting to use a particular session ID.
    app.io.route('session/use', function sessionUse(req) {
        req.io.join(req);
    });

    // User is saving the text they have typed.
    app.io.route('session/save', function sessionSave(req) {
        client.hset('type', req.sessionId, req.text);
        req.io.room(req.sessionId).broadcast('session/text', params.text);
    });

})(process, process.env);