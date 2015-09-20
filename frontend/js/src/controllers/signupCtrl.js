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
 * @ param {jamout.services.InviteOnlyService} inviteOnlyService
 * @constructor
 */
jamout.controllers.SignupController = function($scope, $http, $window, signupService, authService, inviteOnlyService) {

    if (inviteOnlyService.isUserVerified !== true) {
        $window.location.href = "/";
    } 

    /**
    * @expose
    * @type {loginUrl}
    */

    $scope.loginUrl = function(){
        $window.location.href ='/login';
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

          /**
            * Trigger validation flags
            * @expose
            * @type {boolean}
            */
            $scope.submitted = true;


            if ($scope.signupForm.$invalid) {
                $window.console.log('Form is invalid');
                return;
            }

         //window.console.log(signupMode);
       

            signupService.Signup(signupMode)
            
                .success(function(res, status, headers, config) 
                {
                    window.console.log("success response");
                    //window.console.log(res);
                    if(res.data == null) {
                        if (res.message) {
                        window.console.log('message', res.message);
                        /**
                        * @expose
                        * type {String}
                        */
                        $scope.error = 'Error: ' + res.message;
                        return
                      }
                    } 

                    if(res.token){
                        $scope.submitted = false;   
                        authService.isLoggedIn = true;
                        $window.sessionStorage['token'] = res['token'];
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.sessionStorage['token'];
                       // $window.console.log($http.defaults.headers.common['Authorization']);
                        $window.location.href = '/profile';
                     }
                })
                .error(function(res, status, headers, config) 
                {
                    window.console.log("error response");
                    authService.isLoggedIn = false;
                    delete $window.sessionStorage['token'];
                   // window.console.log('res', res)
                    if (res.error) {
                    $scope.error = res.error;
                    }
                    //$window.location.href = '/signup';

                });
        
    }
}

jamout.controllers.SignupController.INJECTS = ['$scope', '$http','$window', 'signupService', 'authService', 'inviteOnlyService', jamout.controllers.SignupController];
