/**
 * Request backend to send users forgotten password
 * @fileoverview
 */

goog.provide('jamout.controllers.ForgotPasswordController');

/**
 *
 * @param $scope
 * @param $window
 * @param {jamout.services.ForgotPasswordService} forgotPasswordService
 * @constructor
 */
jamout.controllers.ForgotPasswordController = function($scope, $window, forgotPasswordService) {

   /** 
   * To store the password
   * @type {Object}
   * @expose
   */
  $scope.forgotPasswordModel = forgotPasswordService.model_;

  /**
   * To check if the email address in the input field is valid
   * @const
   * @expose 
   */
  $scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

  /**
  * @param {Object} model The model received from user input
  * @expose
  * @constructor
  */
  $scope.forgot = function (model) {
      
      if (angular.isObject(model)) {
          /**
          * @param model
          * @expose
          */
          forgotPasswordService.requestPassword(model)
          .success(function(res, headers, status, config){
            $window.console.log('success resposne', res);

            $scope.error = "";
            if (res) {
              $scope.success = res['success'];
            }

          }) 
          .error(function(res, headers, status, config){
            $scope.success = "";
            $window.console.log('error response', res);
            if (res) {
              $scope.error = res['error'];
            }
          })

          
      }
   }


}

jamout.controllers.ForgotPasswordController.INJECTS = ['$scope','$window', 'forgotPasswordService', jamout.controllers.ForgotPasswordController];


