(function($window, $angular) {

    // Bootstrap our lovely application!
    var app = $window.typeApp = $angular.module('typeApp', ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/share/qr-code', {
            templateUrl : 'partials/qr.html'
        });

    }]);

})(window, window.angular);