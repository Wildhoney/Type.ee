(function($app, $angular, $localStorage) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller ApplicationController
     */
    $app.controller('ApplicationController', ['$scope', function applicationController($scope) {

        /**
         * @constant STORAGE_NAME
         * @type {String}
         */
        var STORAGE_NAME = 'session_ids';

        /**
         * @property socket
         * @type {Object}
         */
        $scope.socket = io.connect('http://localhost');

        /**
         * @property sessionId
         * @type {String}
         */
        $scope.sessionId = '';

        /**
         * @method pushSession
         * @param sessionId {String}
         * @return {void}
         */
        $scope.pushSession = function pushSession(sessionId) {

            var storage = $localStorage.getItem(STORAGE_NAME) || [];

            if (storage) {
                storage = $angular.fromJson(storage);
            }

            storage.push(sessionId);
            $localStorage.setItem(STORAGE_NAME, $angular.toJson(storage));

        };

        /**
         * @method popSession
         * @return {String|Boolean}
         */
        $scope.popSession = function popSession() {
            var storage = $localStorage.getItem(STORAGE_NAME) || [];
            return (storage) ? $angular.fromJson(storage).pop() : false;
        };

        // When the connection has been established we'll either use the existing session ID, or create
        // a new one.
        $scope.socket.on('connect', function onConnection() {

            if ($scope.popSession()) {

                // Use the session already saved if we can.
                $scope.sessionId = $scope.popSession();

                $scope.socket.emit('session/fetch', {
                    sessionId: $scope.sessionId
                });

                $scope.$apply();
                return;

            }

            // Otherwise we'll create a brand-new session!
            $scope.socket.emit('session/create');

        });

        // Server has sent us back the session ID!
        $scope.socket.on('session/id', function getSessionId(sessionId) {
            $scope.pushSession(sessionId);
            $scope.sessionId = sessionId;
            $scope.$apply();
        });

    }]);

})(window.typeApp, window.angular, window.localStorage);