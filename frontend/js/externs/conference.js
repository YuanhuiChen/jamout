//TODO

/**
* @param {*} config
* @constructor
*/
var conference = function(config) {};

/**
 * @export
 */
 conference.openDefaultSocket = function(){};

 /**
 * param {*} socket
 * @export
 */
 conference.openDefaultSocket.callback = function(socket){};
 /**
  * @param {*} response
  * @export
  */
 conference.onDefaultSocketResponse = function(response) {};

 /**
  * @param {*} _config
  * @export
  */ 
conference.openSubSocket = function(_config){};


 /**
  * @export
  */ 
conference.openSubSocket.onopen = function(){};


 /**
 * @param {*} _socket
 * @export
 */
conference.openSubSocket.socketConfig.callback = function(_socket){};

//TODO
//peerConfig
//onICE
//onRemoteStream
//onRemoteStreamEnded

 /**
  * @param {*} offerSDP
  * @export
  */ 
conference.initPeer= function(offerSDP){};

 /**
  * @param {*} offerSDP
  * @export
  */ 
conference.afterRemoteStreamStartedFlowing = function(offerSDP){};

 /**
  * @export
  */ 
conference.onRemoteStreamStartsFlowing = function(){};
 /**
 * @param {*} sdp
 * @export
 */
conference.sendsdp = function(sdp){};
/**
* @param {*} response
* @export
*/
conference.socketResponse = function(response){};

/**
* @export
*/
conference.selfInvoker = function(){};

/**
* @export
*/
conference.leave = function(){};

/**
* @param {*} transmitRoomOnce
* @export
*/
conference.startBroadcasting = function(transmitRoomOnce){};

/**
* @param {*} channel
* @export
*/
conference.onNewParticipant = function(channel){};

/**
* @export
*/
conference.uniqueToken= function(){};