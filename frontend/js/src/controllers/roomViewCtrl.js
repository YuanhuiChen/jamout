/**
 * Ctrl for displaying room details at room/:id 
 *
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomViewController');
goog.require('jamout.models.RoomView');


/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param $location
 * @param {jamout.services.RoomViewService} roomViewService
 * @param {jamout.services.AuthService} authService
 * @constructor
 */
jamout.controllers.RoomViewController = function($scope, $http, $window, $location, roomViewService, authService) {


     /**
     * @expose
     * @type {String}
     */
    $scope.header = '';
    

    ///api/room/:id
    var URL = '/api' + $window.location.pathname;

    roomViewService.GetDetails(URL)
            .success(function(res, status, headers, config) 
            {
               if (status === 200) {
                   roomViewService.roomViewModel.username = res['_creator'].username;
                   roomViewService.roomViewModel.title = res.title;
                   $scope.header = roomViewService.roomViewModel.username + "'s Cam - " + roomViewService.roomViewModel.title; 
                   window.console.log("success response"); 
             }

            })
            .error(function(res, status, headers, config) 
            {
                     window.console.log("error response")
                    // Handle view error here
                    //$scope.error = 'Error: Invalid user or password';
                    $window.location.href = '/profile';
                    
            })
    
}



jamout.controllers.RoomViewController.INJECTS = ['$scope', '$http', '$window', '$location', 'roomViewService','authService', jamout.controllers.RoomViewController];
