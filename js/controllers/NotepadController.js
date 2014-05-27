(function($app) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller NotepadController
     */
    $app.controller('NotepadController', ['$scope', function notepadController($scope) {

        /**
         * @property model
         * @type {Object}
         */
        $scope.model = {};

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
        $scope.socket.on('session/data', function sessionText(model) {
            $scope.model = model;
            $scope.$apply();
        });

    }]);

})(window.typeApp);