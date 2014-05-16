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

    }]);

})(window.typeApp);