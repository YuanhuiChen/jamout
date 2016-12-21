/**
* Controller for invite page
* @fileoverview
*/

goog.provide('jamout.controllers.RequestInviteController');
goog.require('jamout.models.RequestInvite');

/**
* @param $scope
* @param $window
* @param {jamout.services.InviteOnlyService} inviteOnlyService
* @constructor
*/

jamout.controllers.RequestInviteController = function($scope, $window, inviteOnlyService) {


 
 /** @expose */
 $scope.requestInviteModel = new jamout.models.RequestInvite();

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

jamout.controllers.RequestInviteController.INJECTS = ['$scope', '$window', 'inviteOnlyService', jamout.controllers.RequestInviteController];


