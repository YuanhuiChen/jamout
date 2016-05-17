/**
 * Service for anonymous room visitors
 * This will serve as a landing page with a live stream and limited interaction
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
jamout.services.RoomViewService.prototype.GetRoomDetails = function(room_path)
{
   
    return this.$http_.get(jamout.services.RoomViewService.ROOM_URL + room_path,  
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
jamout.services.RoomViewService.ROOM_URL = '/api';

jamout.services.RoomViewService.INJECTS =  ['$http', '$window', jamout.services.RoomViewService];