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
 
 /** @export */
 $scope.inviteonlyModel = inviteOnlyService.model;

/** @export */
$scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

 /**
 * To check if the invite code is correct and authorize user
 * @param Model
 * @export
 */
 $scope.verify = function (Model) {

 	if (angular.isString(Model.userInput)) 
 	{

 	    inviteOnlyService.verifyStatus(Model);

	 	if (inviteOnlyService.isUserVerified()) {
	 		$window.location.href = '/welcome';
	 	} else {
	 		/** @export **/
	 		$scope.error = "OH DANG! THIS ISN'T THE SECRET WE'RE LOOKING FOR";
	 	}
	 }	

  }

  /**
  * 
  * @param Model
  * @export
  */
  $scope.requestInvite = function (Model) {

     inviteOnlyService.updateGuestList(Model)
         .success(function(res, headers, status, config) 
            {    
            	$scope.error = "";
                $window.console.log("success response");
                if (res.success) {
                
            	/** @export */
                $scope.success = res['success'];
   				}
                               
            })
            .error(function(res, status, headers, config) 
            {
               $scope.success = "";  
                $window.console.log("error response");               
  				if (res.error) {
                // Handle login errors here
                $scope.error = res['error'];
            }
                
            });
     
  }
}

jamout.controllers.InviteOnlyController.INJECTS = ['$scope', '$window', 'inviteOnlyService', jamout.controllers.InviteOnlyController];


