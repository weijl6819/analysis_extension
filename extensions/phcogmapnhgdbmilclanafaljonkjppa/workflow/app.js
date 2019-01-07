'use strict';

angular.module('goalBuddy', ['ngRoute', 'angularMoment', 'goalBuddy.filters', 'goalBuddy.services', 'goalBuddy.directives', 'goalBuddy.controllers'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/scores', {templateUrl: 'partials/scores.html', controller: 'ScoresController'});
		$routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'ScoresController'});
		$routeProvider.otherwise({redirectTo: '/scores'});
	}]);