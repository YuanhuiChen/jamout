/**
* Search for a contact.
* Add a contact
* @fileoverview
*/
goog.provide('jamout.controllers.ContactsSearchController');

goog.require('jamout.models.SearchContact');



/**
* @param $scope
* @param $http
* @param {jamout.services.ContactsService} contactsService
* @constructor
*/
jamout.controllers.ContactsSearchController = function ($scope, $http, contactsService) {

	/** @expose */
	$scope.success = contactsService.success;
	/** @expose */
	$scope.error = contactsService.error;
	/** @expose */
	$scope.btnlabel = contactsService.btnlabel;
	/** @expose */
	$scope.connectionType = contactsService.connectionType;
	/**@expose */
	$scope.hoverInText = contactsService.hoverInText;
	/**@expose */
	$scope.hoverOutText = contactsService.hoverOutText ;
	/** @expose */
	$scope.users = '';
	/** @expose */
	$scope.btn = '';


	// CONTACT SERVICE LISTENERS
    /**
    * @param {*}
    * @param {String}
    * @export
    */
	$scope.$on('update:connectionType', function(event, connectionType){
		console.log('connection type is', connectionType);
		console.log('event is', event);
		$scope.connectionType = connectionType;
	});

    /**
    * @param {Object} event
    * @param {String} btnlabel
    * @export
    */
	$scope.$on('update:btnlabel', function(event, btnlabel){
		console.log('btn label is', btnlabel);
		$scope.btnlabel = btnlabel;
	});

	 /**
    * @param {Object} event
    * @param {String} btnhoverInText
    * @export
    */
	$scope.$on('update:btnHoverInText', function(event, btnhoverInText){
		console.log('btn label is', btnhoverInText);
		$scope.hoverInText = btnhoverInText;
	});
    /**
    * @param {Object} event
    * @param {String} btnHoverOutText
    * @export
    */
	$scope.$on('update:btnHoverOutText', function(event, btnHoverOutText){
		console.log('update success is', btnHoverOutText);
		$scope.hoverOutText = btnHoverOutText;
	});

    /**
    * @param {Object} event
    * @param {String} error
    * @export
    */
	$scope.$on('update:error', function(event, error){
		console.log('update error is', error);
		$scope.error = error;
	});

	 /**
    * param {Object} event
    * @param {String} success
    * @export
    */
	$scope.$on('update:success', function(event, success){
		console.log('update error is', success);
		$scope.success = success;
	});

	/**
	 * Show hover state on ng-mouseover in the template 
	 * @expose
	 */
	$scope.hoverIn = function () {
		$scope.btnlabel = $scope.hoverInText;
		return;
	};
	/**
	* Show hover state on ng-mouseover in the template 
	* @expose
	*/
	$scope.hoverOut = function () {
		 $scope.btnlabel = $scope.hoverOutText;
		return;
	};


	console.log('search controller is active');
	$scope.searchContacthModel = new jamout.models.SearchContact();

	/** 
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
				contactsService.usersId = res["user"][0]["_id"];
				console.log('contactservice users', contactsService.usersId);
				contactsService.checkContactStatus(contactsService.usersId);

			}
			console.log('success res', res);
		})
		.error(function (res, status){
			console.log('error res', res);
		});
	};


};

jamout.controllers.ContactsSearchController.INJECTS = ['$scope', '$http','contactsService', jamout.controllers.ContactsSearchController];