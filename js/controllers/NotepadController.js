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
         * @param params {Object}
         * @return {void}
         */
        $scope.save = function save(params) {

            $scope.socket.emit('session/save', {
                sessionId: $scope.sessionId,
                text:      params.text
            });

        };

        // Once we've retrieved the data from the session.
        $scope.socket.on('session/text', function sessionText(text) {
            $scope.text = text;
            $scope.$apply();
        });

    }]);

})(window.typeApp);