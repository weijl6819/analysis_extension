'use strict';

angular.module('goalBuddy.controllers', ['ngResource', 'ngRoute'])
	.controller('ScoresController', ['$scope', 'GameData', '$resource', '$route', function($scope, GameData, $resource, $route){
		$scope.gameData = {
			gameList: [],
			settings: new Object,
			theme: '',
			generatorEnabled: false
		};
		$scope.favoriteTeam = 'None';
		$scope.teamList = teamsList;


		$scope.resolve



		//Conditionals
		$scope.showScore = function(message){

			if(message === "Live" || message === "Final")
				return true;
			else
				return false;
		};

		$scope.showStatus = function(message){
			if(message === "Final")
				return true;
			else
				return false;
		};

		$scope.showTimeLeft = function(message){
			if(message === "Live")
				return true;
			return false;

		};

		$scope.showTime = function(message){
			if(message === "Preview")
				return true;
			return false;
		};

		$scope.isHomeWinner = function(homeScore, awayScore, gameState){
			if(gameState === "Final"){
				if(homeScore > awayScore)
					return "success";
				return "danger";
			}
		};

		$scope.isAwayWinner = function(awayScore, homeScore, gameState){
			if(gameState === "Final"){
				if(awayScore > homeScore)
					return "success";
				return "danger";
			}
		};

		$scope.isSelectedTheme = function(message){
			if(message === $scope.gameData.theme)
				return false;

			return true;
		};

		$scope.isGeneratorEnabled = function(){
			if($scope.gameData.generatorEnabled)
				return true;
			return false;
		};

		$scope.isFavoriteTeam = function(team){
			if(team === $scope.favoriteTeam)
				return false;

			return true;
		}

		$scope.isFavoriteTeamInvolved = function(homeTeam, awayTeam){
			if(homeTeam === $scope.favoriteTeam || awayTeam === $scope.favoriteTeam)
				return false;
			return true;
		}

		$scope.isThemeDark = function(theme){
			if(theme === "Dark") return true;
			return false;
		};

		$scope.isThemeBlue = function(theme){
			if(theme === "Blue") return true;
			return false;
		};

		$scope.isThemeLight = function(theme){
			if(theme === "Light") return true;
			return false;
		};

		/*
		///
		/// Get/Set Functions
		///
		*/

		$scope.getSettings = function(){
			chrome.storage.sync.get(function(result){

				if(jQuery.isEmptyObject(result))
				{
					chrome.storage.sync.set({'theme': "Plain"});
					chrome.storage.sync.set({'generatorEnabled': false})
					chrome.storage.sync.set({'favoriteTeam': 'None'});
					return getSettings();
				}

				$scope.gameData.theme = result.theme;
				$scope.gameData.generatorEnabled = result.generatorEnabled;
				$scope.favoriteTeam = result.favoriteTeam;
			});
		};

		$scope.saveSettings = function(){

			if($('#generatorEnabled').is(':checked')){
				chrome.storage.sync.set({'generatorEnabled' : true});
			}
			else
				chrome.storage.sync.set({'generatorEnabled': false});
			var currentTheme = $("#themeSelect").val();
			var currentTeam = $("#favoriteSelect").val();

			chrome.storage.sync.set({'theme': currentTheme});
			chrome.storage.sync.set({'favoriteTeam': currentTeam});

			$("#notifyBox").toggle("slow");
		};

		$scope.init = function(){
			if($route.current.templateUrl === "partials/scores.html"){
				$scope.getSettings();
			}
			else
				$scope.getSettings();
		};


		//Initialize
		$scope.init();
	}]);
