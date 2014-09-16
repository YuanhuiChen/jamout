/**
 * @fileoverview
 */
 
goog.provide('jamout.services.LoginoutService');
goog.require('jamout.models.Login');


/**
 *
 * @param {angular.$http} $http
 * @constructor
 */
jamout.services.LoginoutService = function($http)
{
    this.$http_ = $http;

}

/**
 * @param {jamout.models.Login} loginModel
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.LoginoutService.prototype.Login = function(loginModel)
{
    window.console.log(loginModel);
    return this.$http_.post(jamout.services.LoginoutService.LOGIN_URL, loginModel);
}


jamout.services.LoginoutService.prototype.Logout = function()
{
    this.$http_.post(jamout.services.LoginoutService.LOGOUT_URL);
}


jamout.services.LoginoutService.LOGIN_URL = '/api/login';
jamout.services.LoginoutService.LOGOUT_URL = '/api/logout';


jamout.services.LoginoutService.INJECTS = ['$http', jamout.services.LoginoutService];

