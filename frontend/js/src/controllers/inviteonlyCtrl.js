/**
* Controller for invite page
* @fileoverview
*/

goog.provide('jamout.controllers.InviteOnlyController');
goog.require('jamout.models.InviteOnly');

/**
* @param $scope
* @param $window
* @param {jamout.services.InviteOnlyService} inviteOnlyService
* @constructor
*/

jamout.controllers.InviteOnlyController = function($scope, $window, inviteOnlyService) {


 if (inviteOnlyService.isUserVerified() == true) 
 {
 	return $window.location.href = '/welcome';

 }
 
 /** @expose */
 $scope.inviteonlyModel = inviteOnlyService.model;

/**
 * Regexp pattern to validate Email
 * @const
 * @expose 
 */
$scope.EMAILpattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;


/**
 * Regexp pattern to validate URL
 * @const
 * @expose 
 */
$scope.URLpattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/** 
* @expose
*/ 
$scope.redirectRequestPage = function () {
  return $window.location.href = "/rsvp"
}

 /**
 * To check if the invite code is correct and authorize user
 * @expose
 * @param Model
 */
 $scope.verify = function (Model) {
 // $window.console.log("verifying");
 // $window.console.log(Model);
 	
  if (angular.isString(Model['userInput'])) 
 	{
      /** 
      * @param Model
      * @expose 
      */
 	    inviteOnlyService.verifyStatus(Model);

	 	if (inviteOnlyService.isUserVerified()) {
	 		$window.location.href = '/welcome';
	 	} else {
	 		/** @expose **/
	 		$scope.error = "OH DANG! THIS ISN'T THE SECRET WE'RE LOOKING FOR";
	 	}
	 }	

  }


}

jamout.controllers.InviteOnlyController.INJECTS = ['$scope', '$window', 'inviteOnlyService', jamout.controllers.InviteOnlyController];


