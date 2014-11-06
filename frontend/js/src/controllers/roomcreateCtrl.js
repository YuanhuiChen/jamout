/**
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomCreateController');
goog.require('jamout.models.Room');

/**
 *
 * @param $rootScope
 * @param $location
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.RoomService} roomService
 * @constructor
 */
jamout.controllers.RoomCreateController = function($rootScope, $location, $scope, $http, $window, roomService) {

		/**
		* @expose
		* @type {jamout.models.Room}
		*/
		$scope.roomModel = new jamout.models.Room();

		var userIdObject = {};
	

		/**
		* @expose
		* @param roomMode
		*/
		$scope.create = function(roomMode)
		{
			

			if (roomMode.title !== undefined){

				roomService.CreateRoom(roomMode)			
				.success(function(res, status, headers, config)
				{
					if (status == 200) {
					
					
					// $window.sessionStorage['room'] = JSON.stringify(res);
					 $window.sessionStorage['roomId'] = res;
					// window.console.log($window.sessionStorage['room']);
					//roomService.roomModel.id = res.id;
		
	
					//window.console.log(roomService);
					window.console.log("success response");
					
					$window.location.href = '/room' ;

				  }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response")
					//$window.location.href = '/profile.html';
				})
			}
		}

		

		

}

jamout.controllers.RoomCreateController.INJECTS = ['$rootScope', '$location','$scope', '$http', '$window', 'roomService', jamout.controllers.RoomCreateController];


