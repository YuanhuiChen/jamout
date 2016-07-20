/**
 * Logic for the Contacts Page
 * @fileoverview
 */

goog.provide('jamout.controllers.ContactsController');

/**
 *
 * @param $scope
 * @param $window
 * @param $http
 * @param {jamout.services.ContactsService} contactsService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.ContactsController = function($scope, $window, $http, contactsService, authService) {
   
	if (authService.isUserLoggedIn() === false) {
         $window.location.href = '/login';
    }

	/** @expose */
	$scope.success = "";
	/** @expose */
	$scope.error = "";
	/** @expose */
	$scope.contactsList = "";

	/** @type {String} */
    var successMessage;

    /** @type {String} */
    var errorMessage;
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
	* API request to get contacts
	*/
	contactsService.GetContacts()
	.success(function(res, status){
		if (res["success"][0] == null || 0)  { // no users returned
	    	successMessage = 'Share your username so your friends can add you!';
	    	displayMessage("success", successMessage);
	    return;	 
	   }
	   // console.log('constacts success', res["success"]);
	   $scope.contactsList = res["success"]; 
	})
	.error(function(res, status){
		if (res["error"]) {
		    // console.log(res);
			errorMessage = res["error"];
			displayMessage("error", errorMessage);
			return
		} else {
			errorMessage = "Oops! Cannot retreive your contacts right now. Please try again later";
			displayMessage("error", errorMessage);
			return
		}
	})
	


};

jamout.controllers.ContactsController.INJECTS = ['$scope', '$window','$http','contactsService','authService',jamout.controllers.ContactsController];

