/**
* Admin Service
* @fileoverview
*/
goog.provide('jamout.services.AdminService');


/**
* @param $http
* @constructor
*/
jamout.services.AdminService = function ($http) {

	/** @expose **/
   this.http_ = $http;
}

/**
 * Get Total Rooms
 * @expose
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.AdminService.prototype.getTotalRooms= function ()
{
   
    return this.http_.get(jamout.services.AdminService.GET_TOTAL_ROOMS_URL, 
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
 * Get Total Profiles
 * @expose
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.AdminService.prototype.getTotalProfiles= function ()
{
   
    return this.http_.get(jamout.services.AdminService.GET_TOTAL_PROFILES_URL, 
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
 * Get Guest List Total
 * @expose
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.AdminService.prototype.getTotalGuestListInvites= function ()
{
   
    return this.http_.get(jamout.services.AdminService.GET_TOTAL_GUESTLIST_URL, 
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
jamout.services.AdminService.GET_TOTAL_ROOMS_URL = '/api/room/total';
jamout.services.AdminService.GET_TOTAL_PROFILES_URL = '/api/profile/total';
jamout.services.AdminService.GET_TOTAL_GUESTLIST_URL = '/api/guestlist/total';


jamout.services.AdminService.INJECTS = ['$http', jamout.services.AdminService];

