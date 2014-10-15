/**
 * @fileoverview
 */
 
goog.provide('jamout.services.SignupService');
goog.require('jamout.models.Signup');

/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */
jamout.services.SignupService = function($http, $window)
{
	/** expose */	
    this.$http_ = $http;
    /** expose */
    this.$window_ = $window;
}

/**
 * @param {jamout.models.Signup} signupModel
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.SignupService.prototype.Signup = function(signupModel)
{
    window.console.log(signupModel);
    return this.$http_.post(jamout.services.SignupService.SIGNUP_URL, signupModel);
}


jamout.services.SignupService.SIGNUP_URL = '/api/signup';

jamout.services.SignupService.INJECTS = ['$http','$window', jamout.services.SignupService];