

(function () {

    /* @ngInject */
    function cpToolbar()
    {
        return {
            restrict: 'EA',
            templateUrl: 'app/directives/toolbar/toolbar.chrome.directive.html',
            replace: true
        };
    }

    angular.module('clipto')
        .directive( 'cpToolbar', cpToolbar );

}());