/**
 * service for retrieving and displaying user profile details
 *
 * @fileoverview
 */
 
goog.provide('jamout.services.ProfileService');
goog.require('jamout.models.Profile');


/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.ProfileService = function($http, $window)
{
	
    /** expose */
    this.$http_ = $http;

    /** expose */
    this.$window_ = $window;
}

/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.ProfileService.prototype.GetDetails = function()
{
   
    return this.$http_.get(jamout.services.ProfileService.PROFILE_URL,  
    	{

    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.$window_.localStorage['token'],
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



jamout.services.ProfileService.PROFILE_URL = '/api/profile';

jamout.services.ProfileService.INJECTS =  ['$http', '$window', jamout.services.ProfileService];