/**
 * Client Side Socket.IO wrapper
 *
 * Provides `on` and `emit` methods,
 * but keeps track of all listeners it registers on the socket.
 * A call to `removeAllListeners` will remove all listeners on the
 * socket that were created via this particular instance of jamout.services.Socket.
 *
 * @fileoverview
 */
goog.provide('jamout.services.Socket');




/**
 *  Wrap socket object returned by socketio
 *
 * @param {angular.$rootScope} $rootScope
 * @constructor
 */
jamout.services.Socket = function ($rootScope)
{

  if (typeof io === 'undefined') {
    throw new Error('Socket.io is required');
  }

	/** expose */
	this.socket         = io(jamout.services.Socket.SIGNALLING_SERVER_URL);
	/** expose */
	this._$rootScope    = $rootScope;
	/** expose */
	this.listeners      = [];
}

/**
* Handle socket.emit message from backend
* @param {string} event
* @param {*} callback
* @export
*/
jamout.services.Socket.prototype.on = function (event, callback)
{
	var socket = this.socket;
	var $rootScope = this._$rootScope;

	var wrappedCallback = function() 
	{
	    var args = arguments;
	    
	    $rootScope.$apply(function() {
	      callback.apply(socket, args);
	    });
    };
	// Store the event name and callback so we can remove it later
    this.listeners.push({event: event, fn: wrappedCallback});

    socket.on(event, wrappedCallback)
}

/**
* send Socket Emit Message
* @param {string} event
* @param {string} data
* @param {*} callback
* @export
*/
jamout.services.Socket.prototype.emit = function(event, data, callback) 
{
  var socket = this.socket;
  var $rootScope = this._$rootScope;

  socket.emit(event, data, function() 
  {
    var args = arguments;
    $rootScope.$apply(function() {
      if (callback) {
        callback.apply(socket, args);
      }
    });
  });
 
}


/**
* send Socket Emit Message
* @param {string} event
* @param {string} data
* @param {*} callback
* @export
*/
jamout.services.Socket.prototype.wtf = function(event, data, callback) 
{
  
}

/**
* Remove each of the Stored listeners
* @export
*/
jamout.services.Socket.prototype.removeAllListeners = function() 
{
  for(var i = 0; i < this.listeners.length; i++) {
    var details = this.listeners[i];
    this.socket.removeListener(details.event, details.fn);
  };
}

//jamout.services.Socket.SIGNALLING_SERVER_URL = 'http://localhost:3000';
jamout.services.Socket.SIGNALLING_SERVER_URL = '';

jamout.services.Socket.INJECTS = ['$rootScope', jamout.services.Socket];