/**
 * @module Type.ee
 * @sub-module Session
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function Session($module) {

    var crypto  = require('crypto');

    /**
     * @property Session
     * @constructor
     */
    var Session = function Session() {};

    /**
     * @property prototype
     * @type {Object}
     */
    Session.prototype = {

        /**
         * @method createSession
         * @return {Q.promise}
         */
        createSession: function createSession() {

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

        }

    };

    // Instantiate our session module!
    $module.exports = new Session();

})(module);