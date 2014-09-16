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
 * @constructor
 */
jamout.controllers.LoginController = function($scope, $http, $window) {

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

        window.console.log(loginMode);
        //
        $http.post('/api/login', loginMode)
            .success(function(res, status, headers, config) {
                window.console.log("success response");
            })
            .error(function(res, status, headers, config) {
                window.console.log("error response");

            });
    }
}

jamout.controllers.LoginController.INJECTS = ['$scope', '$http', '$window', jamout.controllers.LoginController];
