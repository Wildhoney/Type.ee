(function($app) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @controller ApplicationController
     */
    $app.controller('ApplicationController', ['$scope', function applicationController($scope) {

        /**
         * @property socket
         * @type {Object}
         */
        $scope.socket = io.connect('http://localhost');

    }]);

})(window.typeApp);