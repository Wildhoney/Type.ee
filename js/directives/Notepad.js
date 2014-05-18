(function($app, $localStorage) {

    /**
     * @module Type.ee
     * @author Adam Timberlake
     * @directive notepad
     */
    $app.directive('notepad', function notepadDirective() {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'A',

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                text: '=notepad',
                save: '&save'
            },

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             */
            link: function link(scope, element) {

                // Bind to the `onKeyUp` event which will save to Redis!
                element.bind('keyup', function() {
                    scope.save({ text: element.val() });
                    scope.$apply();
                });

            }

        }

    });

})(window.typeApp, window.localStorage);