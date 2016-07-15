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



 contactsService.GetPendingContacts()
	.success(function(res, status){
		$scope.error =""; // clear error\
		// console.log('res is', res);
		// console.log('res success is', res["success"]);
		if(res["success"][0] == null || 0) { // if no users retrieved
			console.log('0 pending requests. Share your username so your friends can add you!!');
			return $scope.success = 'Share your username so your friends can add you!';
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
		if (res["error"]) {
		 return $scope.error = res["error"];
		} else {
		return $scope.error = 'Cannot retrieve your contacts. Please try again in a bit';
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
			// console.log('res is', res);

			if (res["success"]) {
				$scope.success = res["success"];
			}
		})
		.error(function(res, status){
			console.log('error received', res);
			// console.log('res is', res);
			isEnabled(index);

			if (res["error"]) {
				$scope.error = res["error"];
			} else {
				$scope.error = "Something is wrong. Please try again later";
			}
		})
	
	}

}

jamout.controllers.ContactsPendingController.INJECTS = ['$scope', '$window','$http','contactsService','authService',jamout.controllers.ContactsPendingController];

