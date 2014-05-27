/**
 * @module Type.ee
 * @sub-module Mongo
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function MongoModule($module, $env) {

    "use strict";

    var mongoose = require('mongoose'),
        q        = require('q');

    /**
     * @property Mongo
     * @constructor
     */
    var Mongo = function Mongo() {

        // Connect to the MongoDB server.
        mongoose.connect($env.MONGOHQ_URL || 'mongodb://localhost/type-ee');

        // ...And create the model to instantiate.
        this.TextModel = mongoose.model('Text', { sessionId: String, text: String, clients: Array });

    };

    /**
     * @property Mongo
     * @type {Object}
     */
    Mongo.prototype = {

        /**
         * @property TextModel
         * @type {Object}
         */
        TextModel: {},

        /**
         * @method createModel
         * @param properties {Object}
         * @return {Mongo.TextModel}
         */
        createModel: function createModel(properties) {
            return new this.TextModel(properties);
        },

        /**
         * @method addClient
         * @param sessionId {String}
         * @param name {String}
         * @return {void}
         */
        addClient: function addClient(sessionId, name) {

            this.getModel(sessionId).then(function then(model) {
                model.clients.addToSet(name);
                model.save();
            });

        },

        /**
         * @method getModel
         * @param sessionId {String}
         * @return {Q.promise}
         */
        getModel: function getModel(sessionId) {

            var deferred = q.defer();

            this.TextModel.findOne({ sessionId: sessionId }, function findText(error, model) {

                if (error) {

                    // We discovered an error in retrieving the model!
                    deferred.reject();
                    throw error;

                }

                // Otherwise everything is okay, and we can resolve the promise.
                deferred.resolve(model);

            });

            return deferred.promise;

        }

    };

    // Instantiate our Mongo module!
    $module.exports = new Mongo();

})(module, process.env);