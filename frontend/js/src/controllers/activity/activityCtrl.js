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

	/**
	* Feed Data 
	* @expose 
	*/
	$scope.activityFeed;
	/** 
	 * Success message
	 * @expose 
	 */
	$scope.success= "";
	/**
	* Error message 
	* @expose 
	*/
	$scope.error = "";
    /**
    * Display success message
    * @type {Boolean}
    * @expose
    */
    $scope.displaySuccessMessage = false;
    /**
    * Display error message
    * @type {Boolean}
    * @expose
    */
    $scope.displayErrorMessage = false; 	
 	/** 
 	* Todo: Move this into a service and use it in other controllers as well
 	* Handles display message
 	* @param {String} msgType - Takes success or error as input
 	* @param {String | Object} msg - Success or Error Message to display
 	*/
 	var displayMessage = function (msgType, msg) {
 		/** @const */
 		var messageType = msgType || ""; 
 		/** @const */
 		var message = msg || ""; 
 		
 		if(messageType === "success") {
 			$scope.displaySuccessMessage = true;
 			$scope.success = message;	
 		}

 		if(messageType === "error") {
 			$scope.displayErrorMessage = true;
 			$scope.error = message;	
 		}
 	};

 	/**
 	* Redirect to room
 	* @param {String} url - Room url to be redirect to
 	* @expose
 	*/
 	$scope.redirectToRoom = function (url) {
 		var redirectURL = url || null;

 		if (angular.isString(url)) {
 			$window.location.href = '/room/' + redirectURL;
 		}
 	};

	activityService.getActivityFeed()
	.success(function(res, headers, status, config){
		if (res["success"]){			
			if (res["success"][0] == null || 0)  { 
				/** @const */
				var successMessage = 'Your contacts cam activity will be here!';
	   			displayMessage("success", successMessage);
		   	} else {
  				$scope.activityFeed = res["success"];
	    }
	  }
	})
	.error(function(res, headers, status, config){
		$scope.error = "";
		if(res["error"]) {
			$scope.error = res["error"];
			displayMessage("error", res["error"])
		} else {
			/** @const */
			var errorMessage = "Cannot communicate with the server atm :/. Please try again later";
			displayMessage("error", errorMessage);
		}
	})

}

jamout.controllers.ActivityController.INJECTS = ['$scope','$window','activityService','authService', jamout.controllers.ActivityController];