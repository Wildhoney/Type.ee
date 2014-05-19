(function($app, $angular) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @directive close
     */
    $app.directive('close', function closeDirective() {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'A',

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             */
            link: function link(scope, element) {

                var closeNode = $angular.element('<a class="close-modal" href="#/">&times;</a>');
                element.append(closeNode);

            }

        };

    });

})(window.typeApp, window.angular);