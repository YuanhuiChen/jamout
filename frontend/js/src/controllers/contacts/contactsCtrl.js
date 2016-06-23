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
	


}

jamout.controllers.ContactsController.INJECTS = ['$scope', '$window','$http','contactsService','authService',jamout.controllers.ContactsController];

