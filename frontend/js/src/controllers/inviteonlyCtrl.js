goog.provide('jamout.controllers.InviteOnlyController');
goog.require('jamout.models.InviteOnly');

/**
* @$scope
* @constructor
*/

jamout.controllers.InviteOnlyController = function($scope) {

 $scope.inviteonlyModel = "";
  
 
 /**
 * @param model
 * @export
 */
 $scope.verify = function (model) {
   // verify code goes here
  }

}

jamout.controllers.InviteOnlyController.INJECTS = ['$scope', jamout.controllers.InviteOnlyController];


