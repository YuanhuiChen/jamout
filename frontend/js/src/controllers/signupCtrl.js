/**
 * @fileoverview
 */

goog.provide('jamout.controllers.SignupController');
goog.require('jamout.models.Signup');

/**
 *
 * @param $scope
 * @param $http
 * @constructor
 */
jamout.controllers.SignupController = function($scope, $http) {


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

jamout.controllers.SignupController.INJECTS = ['$scope', '$http', jamout.controllers.SignupController];
