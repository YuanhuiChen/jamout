/**
* Contains Activity related logic
* @fileoverview
*/
goog.provide('jamout.controllers.ActivityController');

/**
* @param $scope
* @param $window
* @param {jamout.services.ActivityService} activityService
* @param {jamout.services.AuthService} authService
* @constructor
*/
jamout.controllers.ActivityController = function ($scope, $window, activityService, authService) {

	if (authService.isUserLoggedIn() === false) {
		return $window.location.href = '/login';
	}

	// TODO IMPLEMENT BACKEND
	activityService.getActivityFeed()
	.success(function(res, headers, status, config){
		console.log('success ', res);
	})
	.error(function(res, headers, status, config){
		console.log('error ', res);
	})

   console.log('Activity Controller Active');

}

jamout.controllers.ActivityController.INJECTS = ['$scope','$window','activityService','authService', jamout.controllers.ActivityController];