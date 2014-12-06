/**
 * @fileoverview
 */
 
goog.provide('jamout.services.ProfileViewService');


/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.ProfileViewService = function($http, $window)
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
jamout.services.ProfileViewService.prototype.GetDetails = function(URL)
{
   
    return this.$http_.get(URL,  
    	{
    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
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




jamout.services.ProfileViewService.INJECTS =  ['$http', '$window', jamout.services.ProfileViewService];