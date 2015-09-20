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

 if (inviteOnlyService.isUserVerified == true) {
 	return $window.location.href = '/welcome';

 }

 $scope.inviteonlyModel = inviteOnlyService.model;

 /**
 * @param model
 * @export
 */
 $scope.verify = function (Model) {
 	
 	inviteOnlyService.verifyStatus(Model);

 	if (inviteOnlyService.isUserVerified) {
 		$window.location.href = '/welcome';
 	} else {
 		$scope.error = "OH DANG! THIS ISN'T THE SECRET WE'RE LOOKING FOR";
 	}

  }
}

jamout.controllers.InviteOnlyController.INJECTS = ['$scope', '$window', 'inviteOnlyService', jamout.controllers.InviteOnlyController];


