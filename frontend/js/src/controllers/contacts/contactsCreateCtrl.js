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
 * @param {jamout.services.ContactsService} contactsService helper functions
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
    $scope.contactAddId = contact_add_path_id.replace("/profile/", "");
    currentUserId = $window.sessionStorage.getItem('userid');


    // set the current user id in the model
    if ($scope.contactAddId && currentUserId) {
    	$scope.contactCreateModel['currentUserId'] = currentUserId;
    }


    // console.log('currentUserId id is', currentUserId);
    // console.log('contact model id is', $scope.contactCreateModel);

		/**
		*  Send a request to add a contact/user
		* @expose
		* @param contactMode
		*/
		$scope.addContact = function(contactCreateModel)
		{

		   /** @expose */
		   $scope.btnlabel= "Request sent!";

           // console.log("contacts create model", contactCreateModel);

			if (contactCreateModel.contactAddId == "")
			{
				// $scope.error = 'The title is missing';
				return
			} 
				


			contactsService.CreateContact(contactCreateModel)			
				.success(function(res, status)
				{
					if (status == 200) {
	                    // $scope.submitted = false;  
	                    // $scope.success = 'Request success
	                    // '
						window.console.log("success response", res);						

				  }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response");
					window.console.log('res', res);
					window.console.log('status error', status);
				})

		};
};

jamout.controllers.ContactsCreateController.INJECTS = ['$scope', '$window','contactsService', jamout.controllers.ContactsCreateController];


