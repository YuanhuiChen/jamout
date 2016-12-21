/**
 * @fileoverview
 */

goog.provide('jamout.controllers.InviteFriendController');
goog.require('jamout.models.InviteFriend');
/**
* @param $scope
* @param $window
* @param {jamout.services.InviteFriendService} inviteFriendService
* @param {jamout.services.AuthService} authService
* @constructor
*/
jamout.controllers.InviteFriendController = function ($scope, $window, inviteFriendService, authService) {
     
     // $window.console.log("Hello invite controller");

     if (authService.isUserLoggedIn() === false) {
        return $window.location.href = '/login';
    }

     /** @expose */
     $scope.inviteFriendModel = jamout.models.InviteFriend();

    /**
	 * @param {*} Model
	 * @expose
	 * @constructor
     */
     $scope.submit = function (Model) {
     		if (angular.isObject(Model)) {
     			// $window.console.log(Model);
     			inviteFriendService.sendInvite(Model)
     			.success(function(res, headers, status, config) 
            {

                // window.console.log("success response");
                // window.console.log(res);
                $scope.error = "";
                $scope.success = res['success'];
                
            })
            .error(function(res, status, headers, config) 
            {
                 if (status === 401 ) {

                // Handle login errors here
                $scope.success = "";
                $scope.error = "Error response";
                // window.console.log('res is', res);
                // window.console.log("error response");
                //$window.location.href = '/login';
                }
            });
        	}
     }
}

jamout.controllers.InviteFriendController.INJECTS = ['$scope', '$window', 'inviteFriendService', 'authService',jamout.controllers.InviteFriendController];
