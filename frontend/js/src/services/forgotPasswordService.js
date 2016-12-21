/**
 * @fileoverview
 */

goog.provide('jamout.services.ForgotPasswordService');
goog.require('jamout.models.ForgotPassword');

/**
 * @param $http
 * @constructor
 */

jamout.services.ForgotPasswordService = function( $http)
{
    /** @expose */
    this.http_ = $http;

    /** @expose */
    this.model_ = jamout.models.ForgotPassword();
}

/**
 * @expose
 * @param requestPasswordModel
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.ForgotPasswordService.prototype.requestPassword = function (requestPasswordModel)
{
   
    return this.http_.post(jamout.services.ForgotPasswordService.FORGOTPASSWORD_URL, requestPasswordModel, 
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




/** @const */
jamout.services.ForgotPasswordService.FORGOTPASSWORD_URL = '/api/forgot';


jamout.services.ForgotPasswordService.INJECTS = [ '$http', jamout.services.ForgotPasswordService];