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
 * @constructor
 */
jamout.controllers.ContactsPendingController = function($scope, $window, $http, contactsService) {
    /** @expose */
    $scope.contactsPendingModel = new jamout.models.ContactsPending();
         /** @expose */
     $scope.contactsPending="";
     /** @expose */
     $scope.success="";
         /** @expose */
     $scope.error="";



	contactsService.GetPendingContacts()
	.success(function(res, status){
		$scope.error =""; // clear error\
		// console.log('res is', res);
		// console.log('res success is', res["success"]);
		if(res["success"][0] == null || 0) { // if no users retrieved
			console.log('0 pending requests. Share your username so your friends can add you!!');
			return $scope.success = 'Share your username so your friends can add you!';
		}
		$scope.contactsPending = res["success"];

	})
	.error(function(res, status) {
		console.log('rejection received', res);
		if (res["error"]) {
		 return $scope.error = res["error"];
		}
		return $scope.error = 'Cannot retrieve your contacts. Please try again in a bit';
	})

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
			// console.log('res is', res);
			//if success change button text to "user added"
		})
		.error(function(res, status){
			console.log('error received');
			// console.log('res is', res);
		})
	}

}

jamout.controllers.ContactsPendingController.INJECTS = ['$scope', '$window','$http','contactsService' ,jamout.controllers.ContactsPendingController];

