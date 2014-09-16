/**
 * @fileoverview
 */

goog.provide('jamout.controllers.ProfileController');
goog.require('jamout.models.Profile');

/**
 *
 * @param $scope
 * @param $http
 * @constructor
 */
jamout.controllers.ProfileController = function($scope, $http) {


    /**
     * @expose
     * @type {jamout.models.Profile}
     */
    $scope.profileModel = new jamout.models.Profile();

    /**
     * @expose
     * @param profileMode
     */
    $scope.profile = function(profileMode) {

        window.console.log(profileMode);
        //
        $http.post('/api/profile', profileMode)
            .success(function(res, status, headers, config) {
                window.console.log("success response");
            })
            .error(function(res, status, headers, config) {
                window.console.log("error response");

            });
    }
}

jamout.controllers.ProfileController.INJECTS = ['$scope', '$http', jamout.controllers.ProfileController];
