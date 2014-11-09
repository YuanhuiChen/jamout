/**
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomController');
goog.require('jamout.models.Room');


/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.RoomService} roomService
 * @constructor
 */
jamout.controllers.RoomController = function( $scope, $http, $window, roomService) {

		/**
        * @expose
        * @type {jamout.models.Room}
        */
        $scope.ROOM_MODEL = roomService.roomModel;

		/**
        * @expose
        * @type {String}
        */
		$scope.header = '';

		/**@const */
		roomService.roomModel.id = $window.sessionStorage['roomId'];
		roomService.roomModel.username = $window.sessionStorage['username'];
		
	   


		roomService.GetDetails()
				.success(function(res, status, headers, config)
				{
					if (status == 200) {
					//window.console.log(res);

					roomService.roomModel.title = res.title;
					$scope.header = roomService.roomModel.username + "'s Cam - " + roomService.roomModel.title; 
					
					window.console.log("success response");	
					

				 }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response")
					/**
                     * TODO: Handle redirect with backend error handler
                     */
	                // Handle view error here
	                //$scope.error = 'Error: Invalid user or password';
	                $window.location.href = '/profile.html';
					
				})
			
		


}

jamout.controllers.RoomController.INJECTS = ['$scope', '$http', '$window', 'roomService', jamout.controllers.RoomController];


