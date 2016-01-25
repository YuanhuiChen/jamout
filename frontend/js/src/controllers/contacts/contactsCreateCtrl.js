/**
 * Logic for the Contacts Create
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
    /** @const */
	var following_path_id, follower_id, following_id;

	/**@expose */
	$scope.contactCreateModel = new jamout.models.ContactCreate();

    following_path_id = $window.location.pathname;

    //get profile id function

    following_id = following_path_id.replace("/profile/", "");

    follower_id = $window.sessionStorage.getItem('userid');

    if (following_id && follower_id) {
    	$scope.contactCreateModel.follower_id = follower_id;
    	$scope.contactCreateModel.following_id = following_id;

    }


    console.log('follower id is', follower_id);
    console.log('following id is', following_id);
    //TODO
    //set follower id function from session storage
	
	//TODO
	//add a contact


		/**
		* @expose
		* @param contactMode
		*/
		$scope.create = function(contactCreateModel)
		{

           console.log("contacts create model", contactCreateModel);

			// if (contactCreateModel.followed_id== "")
			// {
			// 	//$scope.error = 'The title is missing';
			// 	return
			// } 
				


			contactsService.CreateContact(contactCreateModel)			
				.success(function(res, status)
				{
					if (status == 200) {
	                    // $scope.submitted = false;  
						window.console.log("success response");					

				  }
				})
				.error(function(res,status,headers, config)
				{
					window.console.log("error response");
					window.console.log('res', res);
					window.console.log('status error', status);
				})

		}
}

jamout.controllers.ContactsCreateController.INJECTS = ['$scope', '$window','contactsService', jamout.controllers.ContactsCreateController];


