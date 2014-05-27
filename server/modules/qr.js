/**
 * @module Type.ee
 * @sub-module QR
 * @author Adam Timberlake
 * @link http://github.com/Wildhoney/Type.ee
 */
(function QR($module) {

    "use strict";

    var qrImage = require('qr-image'),
        yaml    = require('yamljs'),
        fs      = require('fs'),
        config  = yaml.load('config.yml');

    /**
     * @property QR
     * @constructor
     */
    var QR = function QR() {};

    /**
     * @property QR
     * @type {Object}
     */
    QR.prototype = {

        /**
         * @method createImage
         * @param sessionId {String}
         * @return {void}
         */
        createImage: function createImage(sessionId) {

            var data  = config.website_url + '#?session=' + sessionId,
                pngQr = qrImage.image(data, { type: 'png' });

            pngQr.pipe(fs.createWriteStream(__dirname + '/../../images/' + sessionId + '.png'));

        }

    };

    // Instantiate our QR module!
    $module.exports = new QR();

})(module);