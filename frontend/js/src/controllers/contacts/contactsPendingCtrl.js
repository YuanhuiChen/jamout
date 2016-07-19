/**
 * Receive pending contacts and and accept them
 * @fileoverview
 */

goog.provide('jamout.controllers.ContactsPendingController');
goog.require('jamout.models.ContactsPending');

/**
 *
 * @param $scope
 * @param $window
 * @param $http
 * @param {jamout.services.ContactsService} contactsService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.ContactsPendingController = function($scope, $window, $http, contactsService, authService) {

	if (authService.isUserLoggedIn() === false) {
         $window.location.href = '/login';
    }

    /**
    * To store pending contact id for the api request 
    * @expose 
    */
    var contactsPendingModel = new jamout.models.ContactsPending();
     
     /**
     * To display pending contacts
     * @type {String}
     * @expose 
     */
     $scope.contactsPending="";
	/** 
	 * To display success message
	 * @type {String}
	 * @expose 
	 */
	$scope.success = contactsService.success;
	/** 
	 * To display error message
	 * @type {String}
	 * @expose 
	 */
	$scope.error = contactsService.error;



    /**
	* Disable btn function
	* @param {number} index - The index of contacts in contactsPending
	*/
	 var isDisabled = function(index){
         	/** @expose */
         	var request = $scope.contactsPending[index];
         	
         	if (request.submitted === false) {
         	    request.submitted = true;
         	} else {
         		request.submitted = false;
    		}
    }

    /**
	* Enable btn upon failure
	* @param {number} index - The index of contacts in contactsPending
	* @returns {Boolean}
	*/	
	 var isEnabled = function(index){
         	/** @expose */
         	var request = $scope.contactsPending[index];
         	
         	if (request.submitted === true) {
         	    request.submitted = false;
         	} 
    }

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



 contactsService.GetPendingContacts()
	.success(function(res, status){
		$scope.error =""; // clear error\

		if(res["success"][0] == null || 0) { // if no users retrieved
			  successMessage = 'Share your username so your friends can add you!';
		      displayMessage("success", successMessage);
			  return;
		} else {
			$scope.contactsPending = res["success"];

	   		// add disable btn property
	   		for (i in $scope.contactsPending) {
	   			$scope.contactsPending[i].submitted = false;
	   		}
	   	}
	})
	.error(function(res, status) {
		console.log('rejection received');
		/** @const */

		if (res["error"]) {
			errorMessage = res["error"];
			displayMessage("error", errorMessage);
			return;
		} else {
			errorMessage = 'Cannot retrieve your contacts. Please try again in a bit';
			displayMessage("error", errorMessage);
			return;
		}
	})

	/**
	* Accept pending contact 
	* @param {string} id - Stores the pending request id
	* @param {number} index - Index of the contactPendingModel that is ng-clicked so we can disable that btn
	* @expose 
	*/
	 $scope.acceptContact = function (id, index) {
	
	 	if ($scope.contactsPending.length > 0) {
		 	for (request in $scope.contactsPending) {
		 		var contactRequest = angular.fromJson($scope.contactsPending[request]);
		 		var contactRequestId = contactRequest["_id"];
		
		 		if (contactRequestId === id) {
	 				contactsPendingModel["id"] = id;
 					return acceptPendingContactRequest(contactsPendingModel, index);
		 		}

		  	}
	    }
	    
	}

	/**
	* Api request to accept pending model
	* @param {Object} contactsPendingModel - Stores the pending model request id
	* @param {number} index - Index of the contactPendingModel so we can disable that btn that is ng-clicked
	*/
    var acceptPendingContactRequest = function (contactsPendingModel, index) {
	
		$scope.success ="";
		$scope.error = "";
	 	isDisabled(index);
	 	

	  contactsService.AcceptPendingContact(contactsPendingModel)
		.success(function(res, status){
			console.log('success received');

			if (res["success"]) {
				successMessage = res["success"];
				displayMessage("success", successMessage);
			}
		})
		.error(function(res, status){
			console.log('error received', res);
			isEnabled(index);

			if (res["error"]) {
				errorMessage = res["error"];
				displayMessage("error", errorMessage);
			} else {
				errorMessage = "Something is wrong. Please try again later";				
				displayMessage("error", errorMessage);
			}
		})
	
	}

}

jamout.controllers.ContactsPendingController.INJECTS = ['$scope', '$window','$http','contactsService','authService',jamout.controllers.ContactsPendingController];

