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
 * @constructor
 */
jamout.controllers.ContactsController = function($scope, $window, $http, contactsService) {
     
	/** @expose */
	$scope.success = "";
	/** @expose */
	$scope.error = "";
	/** @expose */
	$scope.contactsList = "";

	/**
	* API request to get contacts
	*/
	contactsService.GetContacts()
	.success(function(res, status){
		if (res["success"][0] == null || 0)  { // no users returned
			// console.log('no contacts returned');
	    return	$scope.success = 'Share your username so your friends can add you!';
	   }
	   // console.log('constacts success', res["success"]);
	   $scope.contactsList = res["success"]; 
	})
	.error(function(res, status){
		if (res["error"]) {
		    // console.log(res);
			return $scope.error = res["error"];
		} else {
			return $scope.error = "Oops! Cannot retreive your contacts right now. Please try again later";
		}
	})
	
	//TODO
	//add a contact
	//Search for a contact



}

jamout.controllers.ContactsController.INJECTS = ['$scope', '$window','$http','contactsService',jamout.controllers.ContactsController];

