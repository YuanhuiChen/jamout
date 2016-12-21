/**
 * @fileoverview
 */
 
goog.provide('jamout.services.LoginoutService');
goog.require('jamout.models.Login');

//1. You could inject any services in the constructor as parameter. But be make sure, you also change the jamout.services.LoginoutService.INJECTS, when u add a new param
//2. Register the service in login module, see module_login.js
//3. Inject LoginoutService into loginCtrl, see loginCtrl. Same to LoginoutService, don't forget to add 'LoginoutService' into jamout.controllers.LoginController.INJECTS

/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */
jamout.services.LoginoutService = function($http, $window)
{
    /** expose */
    this.$http_ = $http;
    /** expose */
    this.$window_ = $window;
}

/**
 * @param {jamout.models.Login} loginModel
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.LoginoutService.prototype.Login = function(loginModel)
{
    //window.console.log(loginModel);
    return this.$http_.post(jamout.services.LoginoutService.LOGIN_URL, loginModel);
}

/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.LoginoutService.prototype.Logout = function()
{
   return this.$http_.get(jamout.services.LoginoutService.LOGOUT_URL, 
   {
	headers: {
            'Authorization': 'Bearer ' + this.$window_.localStorage['token'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
}


jamout.services.LoginoutService.LOGIN_URL = '/api/login';
jamout.services.LoginoutService.LOGOUT_URL = '/api/logout';



jamout.services.LoginoutService.INJECTS = ['$http','$window', jamout.services.LoginoutService];

