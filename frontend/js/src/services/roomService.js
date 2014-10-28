/**
 * @fileoverview
 */
 
goog.provide('jamout.services.RoomService');
goog.require('jamout.models.Room');

/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @param {angular.$rootScope} $rootScope
 * @constructor
 */

 jamout.services.RoomService = function( $http, $window, $rootScope)
 {
	

    /** @expose */
    this.$http_ = $http;

    /** @expose */
    this.$window_ = $window;

     /** @expose */
    this.$rootScope_ = $rootScope;


    /**
	* @expose
	* @type {jamout.models.Room}
	*/
	this.roomModel = new jamout.models.Room();
   

     /**
    * @expose
    * @type {array} 
    */
    this.clientDataObject = {};
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
   
    return this.$http_.get(jamout.services.RoomService.ROOM_URL,   
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
jamout.services.RoomService.prototype.ProvideRoomOwnerId = function()
{
	return this.id;    
}

/**
* @constructor
*/
jamout.services.RoomService.prototype.ProvideRoomUsername = function()
{
	return this.username;    
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

jamout.services.RoomService.INJECTS =  [ '$http', '$window', jamout.services.RoomService];