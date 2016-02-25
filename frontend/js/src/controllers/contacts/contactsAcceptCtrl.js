goog.provide("jamout.controllers.ContactsAcceptController");
goog.require('jamout.models.ContactsPending');


/**
* @param $http
* @param $scope
* @param {jamout.services.ContactsService} contactsService
* @constructor
*/
jamout.controllers.ContactsAcceptController = function ($http, $scope, contactsService) {

	console.log('conacts Accept Controller is active');
	/** @expose */
	$scope.btnlabel = '';

	/**
	* Accept pending contact 
	* @expose 
	*/
	 $scope.acceptContact = function (contactsPendingModel) {
	 	// $scope.contactsPendingModel.contactId = $scope.contacts._id;
	 	console.log('Contacts pending model is', contactsPendingModel);

		contactsService.AcceptPendingContact(contactsPendingModel)
		.success(function(res, status){
			console.log('success received');
			console.log('res is', res);
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