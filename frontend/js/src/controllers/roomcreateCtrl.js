/**
 * Handles room creation
 *
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomCreateController');
goog.require('jamout.models.Room');

/**
 *
 * @param $location
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.RoomService} roomService
 * @constructor
 */
jamout.controllers.RoomCreateController = function( $location, $scope, $http, $window, roomService) {

		/**
		* @expose
		* @type {jamout.models.Room}
		*/
		$scope.roomModel = roomService.roomModel;

	

		/**
		* @expose
		* @param roomMode
		*/
		$scope.create = function(roomMode)
		{
			$scope.error = ""
			/**
            * Trigger validation flags
            * @expose
            * @type {boolean}
            */
            $scope.submitted = true;

			if (roomMode.title == "")
			{
				//$scope.error = 'The title is missing';
				return
			} 
				
				roomService.CreateRoom(roomMode)			
				.success(function(res, status, headers, config)
				{
					if (status == 200) {
		
		               if(res.data == null) {
	                        if (res.message) {
	                        window.console.log('message', res.message);
	                        window.console.log('Error: ', res['message']);
	                        return
	                      }
	                    }
	                    $scope.submitted = false;  
						window.console.log("success response");					
						$window.sessionStorage['roomId'] = res;
						$window.sessionStorage['room_creator'] = true;
						$window.location.href = '/room' + '/' + $window.sessionStorage['roomId'] ;
						
				  }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response");
					window.console.log('res', res);
					window.console.log('status error', status);
					if (status === 401) {
					  $scope.error = "Error";
					}
				})

		}

		

		

}

jamout.controllers.RoomCreateController.INJECTS = [ '$location', '$scope', '$http', '$window', 'roomService', jamout.controllers.RoomCreateController];


