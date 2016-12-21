/**
* @param {*} connection
* @param {*} socketURL
* @constructor
*/

var initReliableSignaler = function (connection, socketURL){};

/**
* @export
*/
initReliableSignaler.initSocket = function () {};


/**
* @param {config}
* @export
*/
initReliableSignaler.openSignalingChannel = function (config) {};

/**
* @param {config}
* @export
*/
initReliableSignaler.openSignalingChannel.send = function (message) {};
/**
 * @param {*} eventName
 * @param {*} eventHandler
 * @export
 */
initReliableSignaler.listenEventHandler = function (eventName, eventHandler) {};

/**
 * @export
 */
 initReliableSignaler.onLineOffLineHandler = function () {};

 /**
 * @export
 */
 initReliableSignaler.getRandomString = function () {};

 /**
 * @param {*} roomid
 * @param {*} successCallback
 * @export
 */
 initReliableSignaler.createNewRoomOnServer = function(roomid, successCallback){};

 /**
 * @param {*} roomid
 * @param {*} callback
 * @export
 */
 initReliableSignaler.getRoomFromServer = function(roomid, callback){};