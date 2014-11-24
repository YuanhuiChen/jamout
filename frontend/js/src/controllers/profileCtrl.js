/**
 * @fileoverview
 */

goog.provide('jamout.controllers.ProfileController');
goog.require('jamout.models.Profile');


/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.ProfileService} profileService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.ProfileController = function($scope, $http, $window, profileService, authService) {

    
    /**
     * Profile Model to store & display data received from backend
     *
     * @expose
     * @type {jamout.models.Profile}
     */
    $scope.profileModel = new jamout.models.Profile();

     /**
     * @expose
     * @type {String}
     */
    $scope.welcome = '';
    $scope.about ='';
    $scope.location ='';
    $scope.url ='';

   
        
    profileService.GetDetails()
            .success(function(res, status, headers, config) 
            {
               if (status === 200) {
                
                     window.console.log(res);
                    $scope.profileModel.email = res.email;
                    $scope.profileModel.username = res.username;
                    $scope.profileModel.about = res.about;
                    $scope.profileModel.location = res.location;
                    $scope.profileModel.url = res.url;
                    $scope.profileModel.created = res.created;
                    
                    $scope.welcome = "Hey " + $scope.profileModel.username + "!";
                    $scope.about = $scope.profileModel.about;
                    $scope.location ="Representing " + $scope.profileModel.location;
                    $scope.url = $scope.profileModel.url;
                    //TODO: FORMAT DATE
                    $scope.created = "Joined since " + $scope.profileModel.created;

                    
                   
                   // window.console.log("success response");
             }

            })
            .error(function(res, status, headers, config) {
                if (status === 401 ) {
                authService.isLoggedIn = false;
                delete $window.sessionStorage['token'];
                window.console.log('Rejection received. Redirect back to login. ');
                window.console.log("error response");
                /**
                * TODO: Handle redirect with backend error handler
                */
                // Handle view error here
                //$scope.error = 'Error: Invalid user or password';
                $window.location.href = '/login';
            }
            });
    
}



jamout.controllers.ProfileController.INJECTS = ['$scope', '$http', '$window', 'profileService','authService', jamout.controllers.ProfileController];
