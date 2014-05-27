(function($app, $angular, $localStorage, $navigator, $parser) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller ApplicationController
     */
    $app.controller('ApplicationController', ['$scope', '$location',

    function applicationController($scope, $location) {

        /**
         * @constant STORAGE_NAME
         * @type {String}
         */
        var STORAGE_NAME = 'session_ids';

        /**
         * @property socket
         * @type {Object}
         */
        $scope.socket = io.connect();

        /**
         * @property model
         * @type {Object}
         */
        $scope.model = {};

        /**
         * @property sessionId
         * @type {String}
         */
        $scope.sessionId = '';

        /**
         * @property sidebarOpen
         * @type {Boolean}
         */
        $scope.sidebarOpen = ($localStorage.getItem('sidebarOpen') === 'open');

        /**
         * @method toggleSidebar
         * @return {void}
         */
        $scope.toggleSidebar = function toggleSidebar() {

            // Toggle the sidebar open and save the local storage.
            $scope.sidebarOpen = !$scope.sidebarOpen;
            $localStorage.setItem('sidebarOpen', $scope.sidebarOpen ? 'open' : 'closed');

        };

        /**
         * @method parseUserAgents
         * @param userAgents {Array}
         * @return {Array}
         */
        $scope.parseUserAgents = function parseUserAgents(userAgents) {

            var parser = new $parser();

            // Parse each user agent string into its components.
            return _.map(userAgents, function map(userAgent) {
                parser.setUA(userAgent);
                return parser.getResult();
            });

        };

        /**
         * @method fetchSession
         * @return {void}
         */
        $scope.fetchSession = function fetchSession() {

            $scope.socket.emit('session/fetch', {
                sessionId: $scope.sessionId
            });

        };

        // When the connection has been established we'll either use the existing session ID, or create
        // a new one.
        $scope.socket.on('connect', function onConnection() {

            if ($scope.popSession()) {

                // Use the session ID defined in the URL, if it exists, otherwise attempt to use the first
                // one we come across in the local storage.
                $scope.sessionId = $location.search().session || $scope.popSession();

                if ($location.search().session) {

                    // Remove the session ID from the URL as we already have it.
                    $location.search('session', null);

                }

                $scope.fetchSession();
                $scope.$apply();
                return;

            }

            // Otherwise we'll create a brand-new session!
            $scope.socket.emit('session/create');

        });

        // When the session ID has changed.
        $scope.$watch('sessionId', function useSessionId(value) {

            $scope.socket.emit('session/use', {
                sessionId: value,
                userAgent: $navigator.userAgent
            });

        });

        // Server has sent us back the session ID!
        $scope.socket.on('session/id', function getSessionId(sessionId) {

            $scope.pushSession(sessionId);
            $scope.sessionId = sessionId;
            $scope.$apply();

            $scope.fetchSession();

        });

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

    }]);

})(window.typeApp, window.angular, window.localStorage, window.navigator, window.UAParser);