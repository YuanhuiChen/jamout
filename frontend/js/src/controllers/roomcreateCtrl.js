/**
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomCreateController');
goog.require('jamout.models.Room');

/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.RoomService} roomService
 * @constructor
 */
jamout.controllers.RoomCreateController = function($scope, $http, $window, roomService) {

		/**
		* @expose
		* @type {jamout.models.Room}
		*/
		$scope.roomModel = new jamout.models.Room();


	

		/**
		* @expose
		* @param roomMode
		*/
		$scope.create = function(roomMode)
		{
			//window.console.log(roomMode)

			if (roomMode.title !== undefined){

				roomService.CreateRoom(roomMode)			
				.success(function(res, status, headers, config)
				{
					//if (status == 200) {
					window.console.log(res);
					window.console.log(res._creator);
					
					roomService.roomModel.id = res.id;
					
					window.console.log(roomService);
					window.console.log("success response");
					
					$window.location.href = '/room' ;

				 // }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response")
					//$window.location.href = '/profile.html';
				})
			}
		}

		

		

}

jamout.controllers.RoomCreateController.INJECTS = ['$scope', '$http', '$window', 'roomService', jamout.controllers.RoomCreateController];


