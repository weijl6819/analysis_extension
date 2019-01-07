angular.module('goalBuddy.services', [])
	.factory('GameData', function($http){
		var getGames = function(){
			return $http.get('https://statsapi.web.nhl.com/api/v1/schedule?').then(function(response){
				return response.data;
			});
		};

		var getSpecificGame = function(link){
			return $http.get('https://statsapi.web.nhl.com' + link).then(function(response){
				return response.data;
			});
		};

		return {
			getGames: getGames,
			getSpecificGame: getSpecificGame
		};
		//return $resource('https://statsapi.web.nhl.com/api/v1/schedule?', {})
	})	
	.value('version', '0.1');