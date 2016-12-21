/**
 * @fileoverview
 */

goog.provide('jamout.controllers.LogoutController');

/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.AuthService} authService
 * @param {jamout.services.LoginoutService} loginoutService
 * @constructor
 */
jamout.controllers.LogoutController = function($scope, $http, $window, authService, loginoutService) {

   /**
    * 
    * @expose
    * @type {logout}
    */
     $scope.logout = function() {
              
        loginoutService.Logout()
            .success(function(res, status, headers, config) {
                window.console.log("success response");
                if (authService.isLoggedIn)
                    authService.isLoggedIn = false;
                    delete $window.localStorage['token'];
                   $window.location.href = '/welcome.html';
            })
            .error(function(res, status, headers, config) {
                window.console.log("error response");
                // Handle view error here
                // $scope.error = 'Error: Oops. Failed to logout. Please try again later.'
            });
        }

}

jamout.controllers.LogoutController.INJECTS = ['$scope', '$http','$window', 'authService', 'loginoutService', jamout.controllers.LogoutController];


