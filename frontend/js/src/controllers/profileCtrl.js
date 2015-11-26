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
 * @param $location
 * @param {jamout.services.ProfileService} profileService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.ProfileController = function($scope, $http, $window, $location, profileService, authService) {

    if (authService.isUserLoggedIn() === false) {
        return $window.location.href = '/login';
    }

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
    $scope.rooms ='';
   
   
        
    profileService.GetDetails()
            .success(function(res, status, headers, config) 
            {
               if (status === 200) {
                
                   // window.console.log(res);
                    $scope.profileModel.email = res.email;
                    $scope.profileModel.username = res.username;
                    $scope.profileModel.about = res.about;
                    $scope.profileModel.location = res.location;
                    $scope.profileModel.url = res.url;
                    $scope.profileModel.created = res.created;                   
                    $scope.welcome = "Hello " + $scope.profileModel.username + "!";
                    $scope.about = $scope.profileModel.about;
                    if ($scope.profileModel.location) {
                    $scope.location ="From " + $scope.profileModel.location;
                    }
                    $scope.url = $scope.profileModel.url;

                    /** @const */
                    var date = new Date($scope.profileModel.created);
                    $scope.created = "Joined since " + date.toDateString();

                    $window.sessionStorage['username'] = res.username;
                    // $window.console.log(res._id);

                    $window.sessionStorage['userid'] = res._id;
                    $scope.rooms = res.room;
             }


            })
            .error(function(res, status, headers, config) {
               
                authService.isLoggedIn = false;
                delete $window.localStorage['token'];
                window.console.log('Rejection received. Redirect back to login. ');
                window.console.log("error response");
                /**
                * TODO: Handle redirect with backend error handler
                */
                // Handle view error here
                //$scope.error = 'Error: Invalid user or password';
                $window.location.href = '/login';
            
            });
    
}



jamout.controllers.ProfileController.INJECTS = ['$scope', '$http', '$window', '$location', 'profileService','authService', jamout.controllers.ProfileController];
