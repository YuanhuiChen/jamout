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
 * @constructor
 */
jamout.controllers.LoginController = function($scope, $http, $window, loginoutService, authService) {


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
     * @expose
     * @param loginMode
     */
    $scope.login = function(loginMode) 
    {
        
     if ($scope.loginForm.$invalid) {
        $window.console.log('Form is invalid');
        return;
    }

        if (loginMode.email !== undefined && loginMode.password !== undefined) 
        {
        
        loginoutService.Login(loginMode)
            .success(function(res, headers, status, config) 
            {
                window.console.log("success response");
                authService.isLoggedIn = true;
                $window.sessionStorage['token'] = res['token'];
               
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.sessionStorage['token'];
               // window.console.log($http.defaults.headers.common['Authorization']);
                $window.location.href = '/profile';
                
            })
            .error(function(res, status, headers, config) 
            {
                 if (status === 401 ) {
                window.console.log("error response");               
                 authService.isLoggedIn = false;
                 delete $window.sessionStorage['token']; // Erase the token if the user fails to log in
                //window.console.log(res);
                // Handle login errors here
                $scope.error = res.error;

                }
            });
        }

    }


}
//see add loginoutService here
jamout.controllers.LoginController.INJECTS = ['$scope', '$http', '$window', 'loginoutService', 'authService', jamout.controllers.LoginController];
