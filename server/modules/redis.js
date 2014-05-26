/**
 * @module Type.ee
 * @sub-module Redis
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function Redis($module, $environment) {

    var redis = require('redis');

    /**
     * @property Redis
     * @constructor
     */
    var Redis = function Redis() {

        this.client = {};

        // Create the Redis client.
        if ($environment.REDISTOGO_URL) {

            // Client for Heroku.
            var rtg = require('url').parse(process.env.REDISTOGO_URL);
            this.client  = redis.createClient(rtg.port, rtg.hostname);
            this.client.auth(rtg.auth.split(':')[1]);

        } else {

            // Client for development.
            this.client = redis.createClient();

        }

    };

    // Instantiate our Redis module!
    $module.exports = new Redis();

})(module, process.env);