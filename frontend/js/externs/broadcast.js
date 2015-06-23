

/**
* @param {*} config
* @constructor
*/

var broadcast = function (config){};

/**
* @export
*/
broadcast.openDefaultSocket = function () {};

/**
* @export
*/
broadcast.openDefaultSocket.callback = function () {};

/**
* @param {*} response
* @export
*/
broadcast.onDefaultSocketResponse = function(response){};

/**
* @param {*} _config
* @export
*/
broadcast.openSubSocket = function(_config){};
/**
* @export
*/
broadcast.openSubSocket.onopen = function(){};
/**
*@param {*} _socket
*@export
*/
broadcast.openSubSocket.socketConfig.callback = function(_socket){};

/**
* @param {*} candidate
* @export
*/
broadcast.openSubSocket.socketConfig.onICE = function(candidate){};

/**
* @param {*} stream
* @export
*/
broadcast.openSubSocket.socketConfig.onICE = function(stream){};

/**
* @param {*} offerSDP
* @export
*/
broadcast.initPeer = function(offerSDP){};

/**
* @export
*/
broadcast.onRemoteStreamStartsFlowing = function(){};


/**
* @export
*/
broadcast.afterRemoteStreamStartedFlowing = function(){};

/**
* @param {*} sdp
* @export
*/
broadcast.sendsdp = function(sdp){};

/**
* @param {*} response
* @export
*/
broadcast.socketResponse = function(response){};

/**
* @export
*/
broadcast.selfInvoker = function(){};

/**
* @export
*/
broadcast.startBroadcasting = function(){};

/**
* @export
*/
broadcast.uniqueToken = function(){};
/** 
* @param {*} _config
* @export
*/
broadcast.creatRoom = function(_config){};
/**
* @param {*} _config
* @export
*/
broadcast.joinRoom = function(_config){};

