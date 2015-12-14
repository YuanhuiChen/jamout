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

    if (inviteOnlyService.isUserVerified() === false) {
        return $window.location.href = "/";
    } 

    if (authService.isUserLoggedIn() === true) {
       return $window.location.href = '/profile';
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

      // window.console.log(signupMode);
    
        $scope.error = "";
        if (angular.isObject(signupMode))
        {
          /**
            * Trigger validation flags
            * @expose
            * @type {boolean}
            */
            $scope.submitted = true;


        
        if (signupMode.email == "" || signupMode.username == "" || signupMode.password == "" || signupMode.passwordConfirmation == "") 
          {
             return
          }


            signupService.Signup(signupMode)
            
                .success(function(res, status, headers, config) 
                {
                    // window.console.log("success response");
                    // window.console.log(res);
                    if(res['data'] == null) {
                        if (res.message) {
                        window.console.log('message', res.message);
                        /**
                        * @expose
                        * @type {String}
                        */
                        $scope.error = 'Error: ' + res.message;
                        return
                      }
                    } 

                    if(res['token']){
                      // window.console.log('inside res token')
                        $scope.submitted = false;   
                        authService.isLoggedIn = true;
                        $window.localStorage['token'] = res['token'];
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage['token'];
                       // $window.console.log($http.defaults.headers.common['Authorization']);
                        $window.location.href = '/profile';
                     }
                })
                .error(function(res, status, headers, config) 
                {
                    window.console.log("error response");
                    authService.isLoggedIn = false;
                    delete $window.localStorage['token'];
                   // window.console.log('res', res)
                    if (res.error) {
                    $scope.error = res.error;
                    }
                    //$window.location.href = '/signup';

                });
        }
    }
}

jamout.controllers.SignupController.INJECTS = ['$scope', '$http','$window', 'signupService', 'authService', 'inviteOnlyService', jamout.controllers.SignupController];
