/**
 * @fileoverview
 */

goog.provide('jamout.controllers.ProfileViewController');
goog.require('jamout.models.ProfileView');
goog.require('jamout.models.ContactsVerify');




/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param $location
 * @param {jamout.services.ProfileService} profileViewService
 * @param {jamout.services.AuthService} authService
 * @param {jamout.services.ContactsService} contactsService 
 * @constructor
 */
jamout.controllers.ProfileViewController = function($scope, $http, $window, $location, profileViewService, authService, contactsService) {

    
    /**
     * Profile Model to store & display data received from backend
     *
     * @expose
     * @type {jamout.models.ProfileView}
     */
    $scope.profileViewModel = new jamout.models.ProfileView();

    /**
     * Holds the contacts id to verify
     * @type {jamout.models.ContactsVerify}
     */
    $scope.contactVerifyModel = new jamout.models.ContactsVerify();


    /**
     * Profile Intro
     * @type {String}
     * @expose
     */
    $scope.welcome = '';
    /**
     * Profile info
     * @type {String}
     * @expose
     */
    $scope.about ='';
    /**
     * Profile info
     * @type {String}
     * @expose
     */
    $scope.location ='';
    /**
     * Profile info
     * @type {String}
     * @expose
     */
    $scope.url ='';

    /**
     * To dislpay success message 
     * @type {String}
     * @expose
     */
    $scope.success = '';
    /**
     * To display error message
     * @type {String}
     * @expose
     */
    $scope.error = '';
    /**
     * Default btn text
     * @type {String}
     * @expose
     */
    $scope.btnlabel = "Add User";
    /**
     * To help show the type of btn form on the page e.g. add contact / user in contacts / pending request
     * @type {String}
     * @expose
     */
    $scope.connectionType = contactsService.connectionType;
    /**
     * To store the btn label upon hover
     * @type {String}
     * @expose
     */
    $scope.hoverInText = contactsService.hoverInText;
    /**
     * To store the btn label upon hover out
     * @type {String}
     * @expose
     */
    $scope.hoverOutText = contactsService.hoverOutText ;

    /** @const */
    var contact_add_path_id, contactAddId, URL;
    
    
    URL = '/api' + $window.location.pathname;
    contact_add_path_id = $window.location.pathname;
    contactAddId = contact_add_path_id.replace("/profile/", "");
    


    /**
    * ContactsService listener
    * @param {*}
    * @param {String}
    * @export
    */
    $scope.$on('update:connectionType', function(event, connectionType){
        // console.log('connection type is', connectionType);
        // console.log('event is', event);
        $scope.connectionType = connectionType;
    });

    /**
    * ContactsService listener
    * @param {Object} event
    * @param {String} btnlabel
    * @export
    */
    $scope.$on('update:btnlabel', function(event, btnlabel){
        console.log('btn label is', btnlabel);
        $scope.btnlabel = btnlabel;
    });

    /**
    * ContactsService listener
    * @param {Object} event
    * @param {String} btnhoverInText
    * @export
    */
    $scope.$on('update:btnHoverInText', function(event, btnhoverInText){
        console.log('btn label is', btnhoverInText);
        $scope.hoverInText = btnhoverInText;
    });
    /**
     * ContactsService listener
     * @param {Object} event
     * @param {String} btnHoverOutText
     * @export
     */
    $scope.$on('update:btnHoverOutText', function(event, btnHoverOutText){
        console.log('update success is', btnHoverOutText);
        $scope.hoverOutText = btnHoverOutText;
    });

    /**
     * ContactsService listener
     * @param {Object} event
     * @param {String} error
     * @export
     */
    $scope.$on('update:error', function(event, error){
        console.log('update error is', error);
        $scope.error = error;
    });

    /**
    * ContactsService listener
     * param {Object} event
     * @param {String} success
     * @export
     */
    $scope.$on('update:success', function(event, success){
        console.log('update error is', success);
        $scope.success = success;
    });

    /**
     * Show hover state on ng-mouseover in the template 
     * @expose
     */
    $scope.hoverIn = function () {
        $scope.btnlabel = $scope.hoverInText;
        return;
    };
    /**
    * Show hover state on ng-mouseover in the template 
    * @expose
    */
    $scope.hoverOut = function () {
         $scope.btnlabel = $scope.hoverOutText;
        return;
    };


     /**
     * Checks if the current user is already connected or has a request pending
     */
    if (contactAddId) {
        $scope.contactVerifyModel["id"] = contactAddId;
        contactsService.checkContactStatus($scope.contactVerifyModel);
     }
     
     /**
      * Request to get profile view details
      */
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



jamout.controllers.ProfileViewController.INJECTS = ['$scope', '$http', '$window', '$location', 'profileViewService','authService', 'contactsService', jamout.controllers.ProfileViewController];
