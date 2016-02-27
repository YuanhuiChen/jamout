/**
* This controller gets the stats for contacts like # of contacts and # of contact requests
* Add a contact
* @fileoverview
*/
goog.provide('jamout.controllers.ContactsStatsController');

/**
 * Controller logic to get contacts controller
 * @param $scope
 * @param $http
 * @param {jamout.services.ContactsService} contactsService to access contact controller related apis\
 */
jamout.controllers.ContactsStatsController = function ($scope, $http, contactsService) {

	/**
	 * Display success message
	 * @type {String}
	 */
	$scope.success = "";
	/**
	 * Display error message
	 * @type {String}
	 */
	$scope.error = "";

	/**
	 * Display total contacts
	 * @type {String}
	 */
	$scope.contactsTotal = "";

	/**
	 * Display total pending contacts
	 * @type {String}
	 */
	$scope.contactsPendingTotal = "";


	contactsService.getContactStats()
	.success(function(res, status){
		if (res.stats) {
			$scope.contactsTotal = "(" + res.stats.contactsTotal + ")";
			$scope.contactsPendingTotal = "(" + res.stats.contactsPendingTotal+ ")" ;
		}
	})
	.error(function(res, status){
		
		console.log('error res', res);
	});
};

jamout.controllers.ContactsStatsController.INJECTS = ['$scope', '$http', 'contactsService', jamout.controllers.ContactsStatsController];