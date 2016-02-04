/**
 * Logic for the Contacts Page
 * @fileoverview
 */

goog.provide('jamout.controllers.ContactsPendingController');

/**
 *
 * @param $scope
 * @param $window
 * @param $http
 * @param {jamout.services.ContactsService} contactsService
 * @constructor
 */
jamout.controllers.ContactsPendingController = function($scope, $window, $http, contactsService) {
     
	contactsService.GetPendingContacts()
	.success(function(res, status){
		if(res["success"][0] == null || 0) {
			return console.log('0 pending requests. Share your username so your friends can add you!!')
			//$scope.success = 
		}
	})
	.error(function(res, status) {
		return console.log('rejection received', res);
	})

}

jamout.controllers.ContactsPendingController.INJECTS = ['$scope', '$window','$http','contactsService' ,jamout.controllers.ContactsPendingController];

