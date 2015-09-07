goog.provide('jamout.controllers.ProfileEditController');
goog.require('jamout.models.ProfileEdit');

/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param {jamout.services.ProfileEditService} profileEditService
 * @constructor
 */
jamout.controllers.ProfileEditController = function($scope, $http, $window, profileEditService) {

	// todo setup profileditcontroller to send data in the backend

    $scope.profileEditModel = new jamout.models.ProfileEdit();

    /** 
    * @expose
    * @type {String}
    */ 
	$scope.success = ""
    
    /** 
    * @expose
    * @type {String}
    */ 
    $scope.error = ""

    /**
     * @expose
     * @param editModel
     */
    $scope.edit = function(editModel) 
   {
        
        if ($scope.profileEditForm.$invalid) {
            $window.console.log('Form is invalid');
             return;
            }

        profileEditService.EditDetails(editModel)
            .success(function(res, headers, status, config) 
            {

                window.console.log("success response");
               // window.console.log(res);
                $scope.error = "";
                $scope.success = "Profile updated"
                //$window.location.href = '/profile';
                
            })
            .error(function(res, status, headers, config) 
            {
                 if (status === 401 ) {

                // Handle login errors here
                $scope.success = "";
                $scope.error = "Error response";
                window.console.log('Rejection received. Redirect back to login. ');
               // window.console.log('res is', res);
                window.console.log("error response");
                //$window.location.href = '/login';
                }
            });
        

    }
}

jamout.controllers.ProfileEditController.INJECTS = ['$scope', '$http','$window','profileEditService', jamout.controllers.ProfileEditController];


