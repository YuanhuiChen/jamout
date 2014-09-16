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
 * @constructor
 */
jamout.controllers.SignupController = function($scope, $http, $window) {

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
    $scope.signup = function(signupMode) {

        window.console.log(signupMode);
        //
        $http.post('/api/signup', signupMode)
            .success(function(res, status, headers, config) {
                window.console.log("success response");
            })
            .error(function(res, status, headers, config) {
                window.console.log("error response");

            });
    }
}

jamout.controllers.SignupController.INJECTS = ['$scope', '$http','$window', jamout.controllers.SignupController];
