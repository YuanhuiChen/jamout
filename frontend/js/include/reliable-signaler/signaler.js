/**
* @param {*} connection
* @param {*} socketURL
* @constructor
*/
function initReliableSignaler(connection, socketURL) {
    /** @const **/
    var socket;
    
    if (!connection) throw '"connection" argument is required.';
    /**
    * @export
    */
    function initSocket() {
        if (socket && connection && connection.isInitiator && connection.roomid) {
            socket.emit('keep-session', connection.roomid);
        }

        socket = io.connect(socketURL || '/');
        socket.on('connect', function() {
            // if socket.io was disconnected out of network issues
            if (socket.isHavingError) {
                initSocket();
            }
        });
        socket.on('message', function(data) {
            if (onMessageCallbacks[data.channel]) {
                onMessageCallbacks[data.channel](data.message);
            };
        });
        socket.on('error', function() {
            socket.isHavingError = true;
            initSocket();
        });

        socket.on('disconnect', function() {
            socket.isHavingError = true;
            initSocket();
        });
    }
    initSocket();
    /**
     *@type {Array}
     *@const 
     */
    var onMessageCallbacks = {};
    /**
    * @param {config}
    * @export
    */
    // using socket.io for signaling
    connection.openSignalingChannel = function(config) {
        var channel = config.channel || this.channel || 'default-channel';
        onMessageCallbacks[channel] = config.onmessage;
        if(config.onopen) setTimeout(config.onopen, 1);
        return {
           /**
             * @param {*} message
             * @export
             */
            send: function(message) {
                socket.emit('message', {
                    sender: connection.userid,
                    channel: channel,
                    message: message
                });
            },
            channel: channel
        };
    };
    /**
    * @param {*} eventName
    * @param {*} eventHandler
    * @export
    */
    function listenEventHandler(eventName, eventHandler) {
        window.removeEventListener(eventName, eventHandler);
        window.addEventListener(eventName, eventHandler, false);
    }

    listenEventHandler('load', onLineOffLineHandler);
    listenEventHandler('online', onLineOffLineHandler);
    listenEventHandler('offline', onLineOffLineHandler);
    /**
    * @export
    */
    function onLineOffLineHandler() {
        if (!navigator.onLine) {
            console.warn('Internet channel seems disconnected.');
            return;
        }

        // if socket.io was disconnected out of network issues
        if (socket.isHavingError) {
            initSocket();
        }
    }
    /**
    * @export
    */
    function getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            /** @const */
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    }

    return {
        socket: socket,
        /**
        * @param {*} roomid
        * @param {*} successCallback
        * @export
        */
        createNewRoomOnServer: function(roomid, successCallback) {
            // for reusability on failures & reconnect
            connection.roomid = roomid;
            connection.isInitiator = true;
            connection.userid = connection.userid || getRandomString();
            
            socket.emit('keep-in-server', roomid || connection.channel, successCallback || function() {});
        },
        /**
        * @param {*} roomid
        * @param {*} callback
        * @export
        */
        getRoomFromServer: function(roomid, callback) {
            connection.userid = connection.userid || getRandomString();
            socket.emit('get-session-info', roomid, callback);
        }
    };
}