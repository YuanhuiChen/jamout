/**
* Activity Service
* @fileoverview
*/
goog.provide('jamout.services.ActivityService');


/**
* @param $http
* @constructor
*/
jamout.services.ActivityService = function ($http) {

	/** @expose **/
   this.http_ = $http;
}


/**
 * Get Activity Feed
 * @expose
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.ActivityService.prototype.getActivityFeed = function ()
{
   
    return this.http_.get(jamout.services.ActivityService.GET_ACTIVITY_URL, 
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

jamout.services.ActivityService.GET_ACTIVITY_URL = 'api/activity/get';

jamout.services.ActivityService.INJECTS = ['$http', jamout.services.ActivityService];

