(function($app) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller ApplicationController
     */
    $app.controller('ApplicationController', ['$scope', function applicationController($scope) {

        var socket = io.connect('http://localhost');

        socket.on('connection/session/id', function onSessionId(sessionId) {
            console.log(sessionId);
        });

    }]);

})(window.typeApp);