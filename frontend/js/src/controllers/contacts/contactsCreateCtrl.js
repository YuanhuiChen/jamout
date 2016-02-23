/**
 * This controller contains the logic to create a contact
 * @fileoverview
 */

goog.provide('jamout.controllers.ContactsCreateController');
goog.require('jamout.models.ContactCreate');

/**
 *
 * @param $scope
 * @param $window
 * @param {jamout.services.ContactService} contactsService helper functions
 * @constructor
 */
jamout.controllers.ContactsCreateController = function($scope, $window, contactsService) {
    /**
    * @const 
    */
	var currentUserId,
	    contact_add_path_id,
	    contactAddId;


	/**
	* Initialize the contact create model so we can gather date and make an api call
	* @expose 
	*/
	$scope.contactCreateModel = new jamout.models.ContactCreate();

	// TODO: STORE USER ID IN THE ADD BUTTON SO WE CAN RETREIEVE IT FROM THERE
    contact_add_path_id = $window.location.pathname;
    contactAddId = contact_add_path_id.replace("/profile/", "");
    currentUserId = $window.sessionStorage.getItem('userid');



    if (contactAddId && currentUserId) {
    	$scope.contactCreateModel['currentUserId'] = currentUserId;
    	$scope.contactCreateModel['contactAddId'] = contactAddId;
    }


    console.log('currentUserId id is', currentUserId);
    console.log('contactAddId is', contactAddId);
    console.log('contact model id is', $scope.contactCreateModel);
    //TODO
    //set follower id function from session storage
	
	//check relationship
	var checkRelationship = function () {
		// make api request to check the relationship status
		
	}
		/**
		* change to addContact
		* @expose
		* @param contactMode
		*/
		$scope.create = function(contactCreateModel)
		{

		   /** @expose */
		   $scope.btnlabel= "Request sent";

           console.log("contacts create model", contactCreateModel);

			// if (contactCreateModel.followed_id== "")
			// {
			// 	//$scope.error = 'The title is missing';
			// 	return
			// } 
				


			// contactsService.CreateContact(contactCreateModel)			
			// 	.success(function(res, status)
			// 	{
			// 		if (status == 200) {
	  //                   // $scope.submitted = false;  
			// 			window.console.log("success response", res);						

			// 	  }
			// 	})
			// 	.error(function(res,status,headers, config)
			// 	{
			// 		window.console.log("error response");
			// 		window.console.log('res', res);
			// 		window.console.log('status error', status);
			// 	})

		}
}

jamout.controllers.ContactsCreateController.INJECTS = ['$scope', '$window','contactsService', jamout.controllers.ContactsCreateController];


