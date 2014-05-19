(function($app) {

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
                save: '&save',
                loaded: '=loaded'
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

                // Invoked when we've changed the status of the loading.
                scope.$watch('loaded', function hasLoaded(value) {

                    if (value) {

                        // Focus on the textarea element once we've loaded the session.
                        element[0].focus();

                    }

                });

            }

        }

    });

})(window.typeApp);