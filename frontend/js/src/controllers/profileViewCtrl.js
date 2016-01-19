/**
 * @fileoverview
 */

goog.provide('jamout.controllers.ProfileViewController');
goog.require('jamout.models.ProfileView');


/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param $location
 * @param {jamout.services.ProfileService} profileViewService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.ProfileViewController = function($scope, $http, $window, $location, profileViewService, authService) {

    
    /**
     * Profile Model to store & display data received from backend
     *
     * @expose
     * @type {jamout.models.ProfileView}
     */
    $scope.profileViewModel = new jamout.models.ProfileView();

     /**
     * @expose
     * @type {String}
     */

    $scope.welcome = '';
    $scope.about ='';
    $scope.location ='';
    $scope.url ='';
    $scope.addUser = '';

    
    var URL = '/api' + $window.location.pathname;

    profileViewService.GetDetails(URL)
            .success(function(res, status, headers, config) 
            {
               if (status === 200) {
                
                     //window.console.log(res);
                    $scope.profileViewModel.email = res.email;
                    $scope.profileViewModel.username = res.username;
                    $scope.profileViewModel.about = res.about;
                    $scope.profileViewModel.location = res.location;
                    $scope.profileViewModel.url = res.url;
                    $scope.profileViewModel.created = res.created;
                    
                    $scope.welcome = $scope.profileViewModel.username;
                    $scope.about = $scope.profileViewModel.about;
                    if ($scope.profileViewModel.location) {
                    $scope.location ="Representing " + $scope.profileViewModel.location;
                    }
                    $scope.url = $scope.profileViewModel.url;
            
                    var date = new Date($scope.profileViewModel.created);
                    $scope.created = "Joined since " + date.toDateString();

                    //TODO: CHECK IF USER IS FOLLOWING 
                    $scope.addUser = 'Add User';
                    //TODO: MAKE ANOTHE API REQUEST TO CHECK IF USER IS FOLLOWING
                    //TODO: IF TRUE SHOW USER ADDED
                    //TODO: ELSE IF SHOW $scope.addUser = 'Request Pending'   
                    //TODO: IF USER HAS ACCEPTED THE REQUEST
                    //TODO: THEN SHOW $scope.addUser = 'User added'
                    
                   
                   // window.console.log("success response");
             }

            })
            .error(function(res, status, headers, config) {
                if (status === 401 ) {          
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



jamout.controllers.ProfileViewController.INJECTS = ['$scope', '$http', '$window', '$location', 'profileViewService','authService', jamout.controllers.ProfileViewController];
