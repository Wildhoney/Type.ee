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
             * @tpe {String}
             */
            restrict: 'A',

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @param attributes {Object}
             */
            link: function link(scope, element, attributes) {

                // Bind to the `onKeyUp` event which will save to local storage!
                element.bind('keyup', function onKeyUp(event, value) {

                    $localStorage.setItem('text', element.val());

                });

                // Attempt to find the text from the local storage.
                element.val($localStorage.getItem('text'));

            }

        }

    });

})(window.typeApp, window.localStorage);