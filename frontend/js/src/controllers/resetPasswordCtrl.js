/**
* @fileoverview
*/

goog.provide('jamout.controllers.ResetPasswordController');


/**
* @param {angular.$scope} $scope
* @param {angular.$window} $window
* @param {jamout.services.ResetPasswordService} resetPasswordService
* @constructor
*/
jamout.controllers.ResetPasswordController = function ($scope, $window, resetPasswordService) {

	
	/**
	* API endpoint to request
	* @const
	* @expose
	*/
	var REQURL = '/api' + $window.location.pathname;

	/**
	 * Show the redirect url when a successful response for password change is received
	 * Do  not submit the form if it is succesffuly submitted 
	 *@type {Boolean}
	 *@expose
	 */
	 $scope.isSuccessfullySubmitted = false;

	 /**
	 * Redirect to URL
	 * @expose
	 * @type {function()}
	 * @constructor
	 */
	 $scope.loginUrl = function () {
	   $window.location.href ='/login';
	 }

	/**
	* Reset Password model to store form input 
	* @expose
	*/
	$scope.resetPasswordModel = resetPasswordService.resetPasswordModel;

	/**
	* Send a request to reset to 
	* @param {Object} model Contains Password & Password Confirmation 
	* @expose
	* @constructor
	*/
	$scope.reset = function (model) {
		if (!$scope.isSuccessfullySubmitted) {	
			if (angular.isObject(model)) {

				/**
		          * @param REQURL
		          * @param model
		          * @expose
		          */
					resetPasswordService.resetPassword(model, REQURL)
					.success(function(res, status, headers, config) {
						$window.console.log('success', res);
						/** @expose **/
						$scope.error = "";
						$scope.success = "";

							if(res.data == null) {
			                        if (res.message) {
			                        window.console.log('message', res.message);
			                        /**
			                        * @expose
			                        * @type {String}
			                        */
			                        $scope.error = 'Error: ' + res.message;
			                        return
			                      }
			                    } 
							if (res['success']) {
								$scope.success = res['success'];
								$scope.isSuccessfullySubmitted = true;
							}
					})
					.error(function(res, status, headers, config) {
						$window.console.log('error', res);
						/** @expose **/
						$scope.success = ""
						if (res) {
							$scope.error = res['error'];
						}
					})
			}
		}	
	}

}

jamout.controllers.ResetPasswordController.INJECTS = ['$scope','$window','resetPasswordService', jamout.controllers.ResetPasswordController];