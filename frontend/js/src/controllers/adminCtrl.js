/**
* Contains admin panel related logic
* @fileoverview
*/
goog.provide('jamout.controllers.AdminController');

/**
* @param $scope
* @param $window
* @param {jamout.services.AdminService} adminService
* @param {jamout.services.AuthService} authService
* @constructor
*/
jamout.controllers.AdminController = function ($scope, $window, adminService, authService) {

	if (authService.isUserLoggedIn() === false) {
		return $window.location.href = '/login';
	}

	/**
	* Display total rooms
	* @expose
	*/
	$scope.totalRooms;

	/**
	* Display total rooms
	* @expose
	*/
	$scope.totalProfiles;

	// //get total rooms
   	adminService.getTotalRooms()
   	.success(function(res, headers, status, config){
   		console.log('success');
   	 	
   	 	if (angular.isString(res)) {
   		  $scope.totalRooms = res;
  		}
  	})
   	.error(function(res, headers, status, config){
   		console.log('res', res);
   		console.log('error response');
   	})

   	//get total profiles
   	adminService.getTotalProfiles()
   	.success(function(res, headers, status, config){
   		console.log('success');
   		console.log(res);
   	 	if (angular.isString(res)) {
   		  $scope.totalProfiles = res;
  		}
  	})
   	.error(function(res, headers, status, config){
   		console.log(res);
   		console.log('error response');
   	})
}

jamout.controllers.AdminController.INJECTS = ['$scope','$window','adminService','authService', jamout.controllers.AdminController];