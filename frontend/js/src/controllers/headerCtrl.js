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
     

     /** @expose
      * @type {String}
      */
      $scope.user = '';


     if ($window.sessionStorage['username']) 
      {
        $scope.user = $window.sessionStorage['username'];
      } else {
        $scope.user = "Guest";
        
      }
}

jamout.controllers.HeaderController.INJECTS = ['$scope','$window', jamout.controllers.HeaderController];


