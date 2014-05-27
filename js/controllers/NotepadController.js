(function($app) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller NotepadController
     */
    $app.controller('NotepadController', ['$scope', function notepadController($scope) {

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
            $scope.$parent.model = model;
            $scope.$parent.model.clients = $scope.parseUserAgents(model.clients);
            $scope.$apply();
        });

    }]);

})(window.typeApp);