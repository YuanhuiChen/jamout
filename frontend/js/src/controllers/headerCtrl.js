/**
 * @fileoverview
 */

goog.provide('jamout.controllers.HeaderController');

/**
 *
 * @param $scope
 * @param $window
 * @constructor
 */
jamout.controllers.HeaderController = function($scope, $window) {
     

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

     if ($window.sessionStorage['username']) 
      {
        $scope.user = $window.sessionStorage['username'];
        $scope.isCreator = true;
      } else {
        $scope.user = "Login";
        $scope.isCreator = false;
        
      }
}

jamout.controllers.HeaderController.INJECTS = ['$scope','$window', jamout.controllers.HeaderController];


