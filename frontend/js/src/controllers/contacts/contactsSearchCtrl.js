/**
* Logic to search for a contact
* Add a contact
* @fileoverview
*/
goog.provide('jamout.controllers.ContactsSearchController');
goog.require('jamout.models.ContactSearch');
goog.require('jamout.models.ContactsVerify');



/**
 * Search Contact Controller
 * @param $scope
 * @param $http
 * @param {jamout.services.ContactsService} contactsService
 * @constructor
 */
jamout.controllers.ContactsSearchController = function ($scope, $http, contactsService) {
	/**
	 * Model holds contact id to to make serach contact request
	 * @type {jamout.models.SearchContact}
	 */
	$scope.contactSearchModel = new jamout.models.ContactSearch();
	/**
	 * 	Model holds id to make verify contact request
	 * @type {jamout.models.ContactsVerify}
	 */
	$scope.contacstVerifyModel = new jamout.models.ContactsVerify();

	/** 
	 * To display success message
	 * @type {String}
	 * @expose 
	 */
	$scope.success = contactsService.success;
	/** 
	 * To display error message
	 * @type {String}
	 * @expose 
	 */
	$scope.error = contactsService.error;
	/**
     * Default btn text
     * @type {String}
     * @expose
     */
	$scope.btnlabel = contactsService.btnlabel;
    /**
     * To help show the type of btn form on the page e.g. add contact / user in contacts / pending request
     * @type {String}
     * @expose
     */
    $scope.connectionType = contactsService.connectionType;
    /**
     * To store the btn label upon hover
     * @type {String}
     * @expose
     */	
	$scope.hoverInText = contactsService.hoverInText;
    /**
     * To store the btn label upon hover
     * @type {String}
     * @expose
     */
	$scope.hoverOutText = contactsService.hoverOutText ;
	/** 
	 * To display the user upon user search request
	 * @type {String}
	 */
	$scope.users = '';


    
    /**
    * ContactsService listener
    * @param {*}
    * @param {String}
    * @export
    */
    $scope.$on('update:connectionType', function(event, connectionType){
        $scope.connectionType = connectionType;
    });

    /**
    * ContactsService listener
    * @param {Object} event
    * @param {String} btnlabel
    * @export
    */
    $scope.$on('update:btnlabel', function(event, btnlabel){
        $scope.btnlabel = btnlabel;
    });

    /**
    * ContactsService listener
    * @param {Object} event
    * @param {String} btnhoverInText
    * @export
    */
    $scope.$on('update:btnHoverInText', function(event, btnhoverInText){
        $scope.hoverInText = btnhoverInText;
    });
    /**
     * ContactsService listener
     * @param {Object} event
     * @param {String} btnHoverOutText
     * @export
     */
    $scope.$on('update:btnHoverOutText', function(event, btnHoverOutText){
        $scope.hoverOutText = btnHoverOutText;
    });

    /**
     * ContactsService listener
     * @param {Object} event
     * @param {String} error
     * @export
     */
    $scope.$on('update:error', function(event, error){
        $scope.error = error;
    });

    /**
    * ContactsService listener
     * param {Object} event
     * @param {String} success
     * @export
     */
    $scope.$on('update:success', function(event, success){
        $scope.success = success;
    });

	/**
	 * Show hover state on ng-mouseover to change btn text
	 * @expose
	 */
	$scope.hoverIn = function () {
		$scope.btnlabel = $scope.hoverInText;
		return;
	};
	/**
	* Show hover state on ng-mouseover to change btn text
	* @expose
	*/
	$scope.hoverOut = function () {
		 $scope.btnlabel = $scope.hoverOutText;
		return;
	};



	/** 
	 * Search to find contact
	 * @expose
	 * @param  {Object} searchContacthModel Holds the user id to search for
	 * @return {*}                     
	 */
	$scope.searchContact = function(searchContacthModel) {

		console.log('model is', searchContacthModel);
		contactsService.searchContact(searchContacthModel)
		.success(function (res, status){
			$scope.error = '';
			$scope.success = '';
			$scope.users = '';

			if (res["success"]) {
				$scope.success = res["success"];
			}
			if (res["user"]) {
				console.log('res user', res["user"]);
				$scope.users = res["user"];
				$scope.contacstVerifyModel["id"] = res["user"][0]["_id"]["id"]
				console.log('contactservice users', $scope.contacstVerifyModel);
				contactsService.checkContactStatus($scope.contacstVerifyModel);
			}
		})
		.error(function (res, status){
			console.log('error res', res);
		});
	};


};

jamout.controllers.ContactsSearchController.INJECTS = ['$scope', '$http','contactsService', jamout.controllers.ContactsSearchController];