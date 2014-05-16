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

            scope: {
                text: '=notepad'
            },

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             */
            link: function link(scope, element) {

                /**
                 * @constant ENTRY_NAME
                 * @type {String}
                 */
                var ENTRY_NAME = 'text';

                /**
                 * @method setText
                 * @param value {String}
                 * @return {void}
                 */
                var setText = function setText(value) {
                    scope.text = value;
                };

                // Immediately attempt to set the text from the local storage.
                setText($localStorage.getItem(ENTRY_NAME));

                // Bind to the `onKeyUp` event which will save to local storage!
                element.bind('keyup', function() {
                    setText(element.val());
                    scope.$apply();
                });

                // When the text has been updated.
                scope.$watch(ENTRY_NAME, function textUpdated(value) {
                    $localStorage.setItem(ENTRY_NAME, value);
                    element.val(value);
                });

            }

        }

    });

})(window.typeApp, window.localStorage);