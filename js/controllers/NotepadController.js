(function($app) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller NotepadController
     */
    $app.controller('NotepadController', ['$scope', function notepadController($scope) {

        /**
         * @property $scope.text
         * @type {String}
         */
        $scope.text = '';

        /**
         * @method save
         * @param text {String}
         * @param sessionId {String}
         * @return {void}
         */
        $scope.save = function save(text, sessionId) {
            $scope.socket.emit('text/save', { sessionId: sessionId, text: $scope.text });
        };

        // When we've received the session ID from the Node.js backend.
        $scope.socket.on('connection/session/id', function onSessionId(sessionId) {

            // Initially save the text from the local storage.
            if ($scope.text) {
                $scope.save($scope.text, sessionId);
            }

        });

    }]);

})(window.typeApp);