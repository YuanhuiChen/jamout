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
 * @const
 * @expose 
 */
$scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

/** 
* @expose
*/ 
$scope.guestlistUrl = function () {
  return $window.location.href = "/requestinvite"
}

 /**
 * To check if the invite code is correct and authorize user
 * @expose
 * @param Model
 */
 $scope.verify = function (Model) {
 $window.console.log("verifying");
 $window.console.log(Model);
 	
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

  /**
  * 
  * @param {*} Model
  * @expose
  * @constructor
  */
  $scope.requestInvite = function (Model) {

      /** 
      * @param Model
      * @expose
      */
     inviteOnlyService.updateGuestList(Model)
         .success(function(res, headers, status, config) 
            {    
            	$scope.error = "";
                $window.console.log("success response");
                if (res.success) {
                
            	/** @expose */
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


