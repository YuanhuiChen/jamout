/**
 * Service for displaying room details at room/:id 
 *
 * @fileoverview
 */
 
goog.provide('jamout.services.RoomViewService');
goog.require('jamout.models.RoomView');

/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.RoomViewService = function($http, $window)
{
	
    /** expose */
    this.$http_ = $http;

    /** expose */
    this.$window_ = $window;

    /**
    * @expose
    * @type {jamout.models.RoomView}
    */
    this.roomViewModel = new jamout.models.RoomView();

}

/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomViewService.prototype.GetDetails = function(URL)
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




jamout.services.RoomViewService.INJECTS =  ['$http', '$window', jamout.services.RoomViewService];