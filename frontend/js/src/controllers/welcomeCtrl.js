goog.provide('jamout.controllers.WelcomeController');

/**
* @param $scope
* @param $window
* @param {jamout.services.InviteOnlyService} inviteOnlyService
* @constructor
*/
jamout.controllers.WelcomeController = function($scope, $window, inviteOnlyService) {
	
   	if (inviteOnlyService.isUserVerified !== true) {
 		return $window.location.href = "/";
 	}
 	
 }

jamout.controllers.WelcomeController.INJECTS = ['$scope','$window', 'inviteOnlyService', jamout.controllers.WelcomeController];


