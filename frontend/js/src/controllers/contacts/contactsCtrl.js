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
 * @constructor
 */
jamout.controllers.ContactsController = function($scope, $window, $http) {
     
	console.log('Contacts Create Controller is active!');

	//get contacts
	$http.get('api/contacts/get')
	.success(function(res, status){
		console.log('success', res);
	})
	.error(function(res, status){
		console.log('error', error);
	})
	
	//TODO
	//add a contact
	//Search for a contact
	//Get contacts with active relationships
	//Get contacts with passive relationships ( not accepted from one of the users) 



}

jamout.controllers.ContactsController.INJECTS = ['$scope', '$window','$http',jamout.controllers.ContactsController];

