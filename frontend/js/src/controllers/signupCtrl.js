/**
 * @fileoverview
 */

goog.provide('jamout.controllers.SignupController');
goog.require('jamout.models.Signup');

/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.SignupService} signupService
 * @ param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.SignupController = function($scope, $http, $window, signupService, authService) {

    /**
    * @expose
    * @type {loginUrl}
    */

    $scope.loginUrl = function(){
        $window.location.href ='/login.html';
    };

    

    /**
     * @expose
     * @type {jamout.models.Signup}
     */
    $scope.signupModel = new jamout.models.Signup();

    /**
     * @expose
     * @param signupMode
     */
    $scope.signup = function(signupMode) 
    {

        window.console.log(signupMode);
         if (signupMode.email !== undefined && signupMode.password !== undefined && signupMode.passwordConfirmation !== undefined) 
         {

            signupService.Signup(signupMode)
            //$http.post('/api/signup', signupMode)
                .success(function(res, status, headers, config) 
                {
                    window.console.log("success response");
                    authService.isLoggedIn = true;
                    $window.sessionStorage['token'] = res['token'];
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.sessionStorage['token'];
                    window.console.log($http.defaults.headers.common['Authorization']);
                    $window.location.href = '/profile.html';
                })
                .error(function(res, status, headers, config) 
                {
                    authService.isLoggedIn = false;
                    delete $window.sessionStorage['token'];
                    window.console.log("error response");
                    // TODO Handle login errors here
                    //$scope.error = 'Error: Invalid user or password';
                    $window.location.href = '/signup.html';

                });
        }
    }
}

jamout.controllers.SignupController.INJECTS = ['$scope', '$http','$window', 'signupService', 'authService', jamout.controllers.SignupController];
