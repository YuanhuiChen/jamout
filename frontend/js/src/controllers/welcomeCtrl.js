goog.provide('jamout.controllers.WelcomeController');

/**
* @param $scope
* @param $window
* @param {jamout.services.InviteOnlyService} inviteOnlyService
* @param {jamout.services.AuthService} authService
* @constructor
*/
jamout.controllers.WelcomeController = function($scope, $window, inviteOnlyService, authService) {


 	if (inviteOnlyService.isUserVerified() === false) {
 		return $window.location.href = "/";
 	} 

 	if (authService.isUserLoggedIn() == true) {
		return $window.location.href = '/profile';
	}
 	
 }

jamout.controllers.WelcomeController.INJECTS = ['$scope','$window', 'inviteOnlyService','authService', jamout.controllers.WelcomeController];


