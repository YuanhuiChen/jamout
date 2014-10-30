/**
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomController');
goog.require('jamout.models.Room');


/**
 *
 * @param $rootScope
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.RoomService} roomService
 * @constructor
 */
jamout.controllers.RoomController = function($rootScope, $scope, $http, $window, roomService) {

		/**
		* To store & display data received from backend
		* @expose
		* @type {jamout.models.Room}
		*/
		//$scope.roomModel = new jamout.models.RoomDetail();

	     /**@const */	
		// var config = {
  //       headers: 
  //       {
  //           'Authorization': 'Bearer ' + $window.sessionStorage['token'],
  //           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  //       }
		// }
		
		$scope.RoomId = 0;

		$scope.$on('ValueUpdated', function() {
	        // roomService.UpdateRoomId($scope.RoomId);
	         $scope.RoomId = roomService.clientDataObject.id;
	    }); 		

	    window.console.log($scope.RoomId);

		roomService.GetDetails()
				.success(function(res, status, headers, config)
				{
					if (status == 200) {
					window.console.log(res);
				
					window.console.log("success response");	
				
					// $scope.$on('ROOM_ID_UPDATE', function(event, userDataObject) {
					// window.console.log(userDataObject);
				 //    });
					

				 }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response")
					
				})
			
		


}

jamout.controllers.RoomController.INJECTS = ['$rootScope','$scope', '$http', '$window', 'roomService', jamout.controllers.RoomController];


