/**
* @fileoverview
*/

goog.provide('jamout.services.ResetPasswordService');
goog.require('jamout.models.ResetPassword');

/**
* @param{angular.$http} $http
* @param{angular.$window} $window
* @constructor
*/
jamout.services.ResetPasswordService = function ($http, $window) {

	/** 
	* @expose
	*/
	this.http_ = $http;


	/** 
	* @expose
	*/
	this.window_ = $window;

	
	/**
	* @expose
	* @type {jamout.models.ResetPassword}
	*/
	this.resetPasswordModel = new jamout.models.ResetPassword();


}



/**
 * @expose
 * @param requestPasswordModel
 * @param URL
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.ResetPasswordService.prototype.resetPassword = function (resetPasswordModel, URL)
{
   
    return this.http_.post(URL, resetPasswordModel, 
        {

        /**@const */    
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        /**@const */
        transformRequest: function(obj) 
        {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
        
    });
}

/** 
* /api/reset/:token
*@const 
*/
jamout.services.ResetPasswordService.RESET_URL = '/api' + jamout.services.ResetPasswordService.PATH;

jamout.services.ResetPasswordService.INJECTS = ['$http','$window', jamout.services.ResetPasswordService];