goog.provide("jamout.controllers.ContactsAcceptController");
goog.require('jamout.models.ContactsPending');


/**
* @param $http
* @param $scope
* @param {jamout.services.ContactsService} contactsService
* @constructor
*/
jamout.controllers.ContactsAcceptController = function ($http, $scope, contactsService) {

	/** @expose */
	$scope.btnlabel = '';

	/**
	* Accept pending contact 
	* @expose 
	*/
	 $scope.acceptContact = function (contactsPendingModel) {
		contactsService.AcceptPendingContact(contactsPendingModel)
		.success(function(res, status){
			$scope.btnlabel = "User Added";
			//if success change button text to "user added"
		})
		.error(function(res, status){
			console.log('error received');
			console.log('res is', res);
		})
	}

}

jamout.controllers.ContactsAcceptController.INJECTS = ['$http', '$scope', 'contactsService', jamout.controllers.ContactsAcceptController];