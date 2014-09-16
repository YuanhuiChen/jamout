/**
 * @fileoverview
 */

goog.provide('jamout.controllers.LoginController');
goog.require('jamout.models.Login');
goog.require('jamout.factory.AuthenticationService');
// goog.require('jamout.factory.UserService');



/**
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param $location
 * @param AuthenticationService
 * @constructor
 */
jamout.controllers.LoginController = function($scope, $http, $window, $location, AuthenticationService) {


    // var AuthenticationService = function () {
    //     var auth = {
    //     isLogged: false
    //   }

    //     return auth;
    
    // }

     /**
    * @expose
    * @type {signupUrl}
    */

    $scope.signupUrl = function() {
        $window.location.href ='/signup.html';
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
    $scope.login = function(loginMode) {
       // if (loginMode.email !== undefined && loginMode.password != undefined)



        window.console.log(loginMode);
        

        $http.post('/api/login', loginMode)
            .success(function(res, status, headers, config, data) {
                window.console.log("success response");
               // AuthenticationService.isLogged = true;
                //$window.sessionsStorage.token = data.token;
                $location.path("/profile");
            })
            .error(function(res, status, headers, config, data) {
                window.console.log(status, data)
                window.console.log("error response");

            });

        // UserService.logIn( loginMode)
        //     .success(function(res, status, headers, config, data) {
        //         window.console.log("success response");
        //         AuthenticationService.isLogged = true;
        //         $window.sessionsStorage.token = data.token;
        //         $location.path("/profile");
        //     })
        //     .error(function(res, status, headers, config, data) {
        //         window.console.log(status, data)
        //         window.console.log("error response");

        //     });    
    }

 
}


jamout.controllers.LoginController.INJECTS = ['$scope', '$http', '$window', '$location', jamout.factory.AuthenticationService.INJECTS, jamout.controllers.LoginController];