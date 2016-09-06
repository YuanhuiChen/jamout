/**
 * @fileoverview
 */

goog.provide('jamout.controllers.HeaderController');

/**
 *
 * @param $scope
 * @param $window
 * @param $location
 * @constructor
 */
jamout.controllers.HeaderController = function($scope, $window, $location) {
     

     /**
      * @expose
      * @type {String}
      */
      $scope.user = '';

      /** 
      * @expose
      * @type {Boolean}
      */
      $scope.isCreator = false;



      /**
      *  Todo: Check with session id instead of username to verify if its the user is creator ->CHECK ROOMCTRL
      */
     if ($window.sessionStorage['username']) 
      {
        $scope.user = $window.sessionStorage['username'];
        $scope.isCreator = true;
      } else {
        $scope.user = "login";
        $scope.isCreator = false;
        $scope.RSVP = "RSVP";
        
      }



  /*****************ui-bootstrap ********************************/


  // todo: create a modal instance controller

}

jamout.controllers.HeaderController.INJECTS = ['$scope','$window','$location', jamout.controllers.HeaderController];


