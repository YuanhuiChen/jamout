/**
 * @fileoverview
 */
 
goog.provide('jamout.services.RoomService');
goog.require('jamout.models.Room');

/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.RoomService = function( $http, $window)
 {
	

    /** @expose */
    this.$http_ = $http;

    /** @expose */
    this.$window_ = $window;


    /**
	* @expose
	* @type {jamout.models.Room}
	*/
	this.roomModel = new jamout.models.Room();
   
}

/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.CreateRoom = function(roomModel)
{
   
    return this.$http_.post(jamout.services.RoomService.ROOM_CREATE_URL, roomModel,  

    	{
    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        
    });
}


/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.GetDetails = function()
{
   
    return this.$http_.get(jamout.services.RoomService.ROOM_ID_URL + this.$window_.sessionStorage['roomId'] ,   
    	{
    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        
    });
}



/**
* @constructor
*/
jamout.services.RoomService.prototype.ProvideRoomModel = function()
{
	return this.roomModel;    
}



jamout.services.RoomService.ROOM_URL = '/api/room';
jamout.services.RoomService.ROOM_CREATE_URL = '/api/room/create';
jamout.services.RoomService.ROOM_ID_URL = '/api/room/';

jamout.services.RoomService.INJECTS =  [ '$http', '$window', '$rootScope', jamout.services.RoomService];

