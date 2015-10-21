/**
 * @fileoverview
 */

goog.provide('jamout.controllers.LoginController');
goog.require('jamout.models.Login');



/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.LoginoutService}  loginoutService
 * @param {jamout.services.AuthService} authService
 * @param {jamout.services.InviteOnlyService} inviteOnlyService
 * @constructor
 */
jamout.controllers.LoginController = function($scope, $http, $window, loginoutService, authService, inviteOnlyService) {

  if (inviteOnlyService.isUserVerified() === false) {
        return $window.location.href = "/";
    } 

     /**
    * @expose
    * @type {signupUrl}
    */

    $scope.signupUrl = function() 
    {
        $window.location.href ='/signup';
    };

    /**
     * @expose
     * @type {jamout.models.Login}
     */
    $scope.loginModel = new jamout.models.Login();



    /**
     * @const
     * @expose 
     */
    $scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    /**
     * @expose
     * @param loginMode
     * @type {Object}
     */
    $scope.login = function(loginMode) 
    {
        
      if (angular.isObject(loginMode)) {
        if (loginMode.email == "" || loginMode.password == "") 
        {
            return    
        }
        
        loginoutService.Login(loginMode)
            .success(function(res, headers, status, config) 
            {
                window.console.log("success response", res);
                authService.isLoggedIn = true;
                $window.localStorage['token'] = res['token'];
               
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage['token'];
               // window.console.log($http.defaults.headers.common['Authorization']);
                $window.location.href = '/profile';
                
            })
            .error(function(res, status, headers, config) 
            {  
                
                if (status === 401 || 500) {
                window.console.log("error response");                     
                 authService.isLoggedIn = false;
                 delete $window.localStorage['token']; // Erase the token if the user fails to log in
                 window.console.log('res error', res);
                // Handle login errors here
                $scope.error = res.error;

                }

            });
        }

    }


}
//see add loginoutService here
jamout.controllers.LoginController.INJECTS = ['$scope', '$http', '$window', 'loginoutService', 'authService', 'inviteOnlyService', jamout.controllers.LoginController];
