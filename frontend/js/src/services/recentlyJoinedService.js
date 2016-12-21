/**
 * @fileoverview
 */
 
goog.provide('jamout.services.RecentlyJoinedService');


/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.RecentlyJoinedService = function($http, $window)
{
	
    /** @expose */
    this.http_ = $http;


    /** @expose */
    this.window_ = $window;

    /** @expose */
    this.users;

}

/**
 * Get 5 recent users that have joined
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RecentlyJoinedService.prototype.getUsers = function()
{
   
    return this.http_.get(jamout.services.RecentlyJoinedService.RECENT_USER_URL ,
    	{
    	/**@const */	
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        
    });
}



jamout.services.RecentlyJoinedService.RECENT_USER_URL = '/api/profile/recent';

jamout.services.RecentlyJoinedService.INJECTS =  ['$http', jamout.services.RecentlyJoinedService];