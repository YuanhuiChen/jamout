/**
 * client socket logic 
 *
 * @fileoverview
 */
// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

// This library is known as multi-user connectivity wrapper!
// It handles connectivity tasks to make sure two or more users can interconnect!

/**
* @param {*} config
* @constructor
*/
var conference = function(config) {
    /**
    * @type {Object}
    * @export
    */
    var self = {
        userToken: uniqueToken()
    };
    /** @const*/
    var channels = '--',
        isbroadcaster;
    /**
    * @type {Boolean}
    * @const
    */
    var isGetNewRoom = true;
    /**
    * @type {Array}
    * @const
    */
    var sockets = [];
    /**
    * @type {Object}
    * @const
    */
    var defaultSocket = {};
    /**
    * @export
    */
    function openDefaultSocket() {
        /**
         * @export
         */
        defaultSocket = config.openSocket({
            onmessage: onDefaultSocketResponse,
            /**
            * @param {*} socket
            * @export
            */
            callback: function(socket) {
                defaultSocket = socket;
            }
        });
    }
    /**
    * @param {*} response
    * @export
    */
    function onDefaultSocketResponse(response) {
        if (response.userToken == self.userToken) return;

        if (isGetNewRoom && response.roomToken && response.broadcaster) config.onRoomFound(response);

        if (response.newParticipant && self.joinedARoom && self.broadcasterid == response.userToken) onNewParticipant(response.newParticipant);

        if (response.userToken && response.joinUser == self.userToken && response.participant && channels.indexOf(response.userToken) == -1) {
            channels += response.userToken + '--';
            openSubSocket({
                isofferer: true,
                channel: response.channel || response.userToken
            });
        }

        // to make sure room is unlisted if owner leaves		
        if (response.left && config.onRoomClosed) {
            config.onRoomClosed(response);
        }
    }
    /**
    * @param {*} _config
    * @export
    */
    function openSubSocket(_config) {
        if (!_config.channel) return;
        
        /**
        * @type {Object}
        * @export
        * @const
        */
        var socketConfig = {
            channel: _config.channel,
            onmessage: socketResponse,
            /**
            * @export
            */
            onopen: function() {
                if (isofferer && !peer) initPeer();
                sockets[sockets.length] = socket;
            }
        };
        /**
        * @param {*} _socket
        * @export
        */
        socketConfig.callback = function(_socket) {
            socket = _socket;
            this.onopen();
        };
        /** 
        * @export
        * @const 
        */
        var socket = config.openSocket(socketConfig),
            isofferer = _config.isofferer,
            gotstream,
            video = document.createElement('video'),
            inner = {},
            peer;
        /**
        * @type {Object}
        * @export
        * @const
        */    
        var peerConfig = {
            attachStream: config.attachStream,
            /**
            * @param {*} candidate
            * @export
            */
            onICE: function(candidate) {
                socket.send({
                    userToken: self.userToken,
                    candidate: {
                        sdpMLineIndex: candidate.sdpMLineIndex,
                        candidate: JSON.stringify(candidate.candidate)
                    }
                });
            },
            /**
            * @param {*} stream
            * @export
            */
            onRemoteStream: function(stream) {
                if (!stream) return;

                video[moz ? 'mozSrcObject' : 'src'] = moz ? stream : webkitURL.createObjectURL(stream);
                video.play();

                _config.stream = stream;
                onRemoteStreamStartsFlowing();
            },
            /**
            * @param {*} stream
            * @export
            */
            onRemoteStreamEnded: function(stream) {
                if (config.onRemoteStreamEnded)
                    config.onRemoteStreamEnded(stream, video);
            }
        };
        /**
        * @param {*} offerSDP
        * @export
        */
        function initPeer(offerSDP) {
            if (!offerSDP) {
                peerConfig.onOfferSDP = sendsdp;
            } else {
                peerConfig.offerSDP = offerSDP;
                peerConfig.onAnswerSDP = sendsdp;
            }

            peer = RTCPeerConnection(peerConfig);
        }
        /**
        * @export
        */
        function afterRemoteStreamStartedFlowing() {
            gotstream = true;

            if (config.onRemoteStream)
                config.onRemoteStream({
                    video: video,
                    stream: _config.stream
                });

            if (isbroadcaster && channels.split('--').length > 3) {
                /* broadcasting newly connected participant for video-conferencing! */
                defaultSocket.send({
                    newParticipant: socket.channel,
                    userToken: self.userToken
                });
            }
        }
        /**
        * @export
        */
        function onRemoteStreamStartsFlowing() {
            if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i)) {
                // if mobile device
                return afterRemoteStreamStartedFlowing();
            }

            if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                afterRemoteStreamStartedFlowing();
            } else setTimeout(onRemoteStreamStartsFlowing, 50);
        }
        /**
        * @param {*} sdp
        * @export
        */
        function sendsdp(sdp) {
            socket.send({
                userToken: self.userToken,
                sdp: JSON.stringify(sdp)
            });
        }
        /**
        * @param {*} response
        * @export
        */
        function socketResponse(response) {
            if (response.userToken == self.userToken) return;
            if (response.sdp) {
                inner.sdp = JSON.parse(response.sdp);
                selfInvoker();
            }

            if (response.candidate && !gotstream) {
                if (!peer) console.error('missed an ice', response.candidate);
                else
                    peer.addICE({
                        sdpMLineIndex: response.candidate.sdpMLineIndex,
                        candidate: JSON.parse(response.candidate.candidate)
                    });
            }

            if (response.left) {
                if (peer && peer.peer) {
                    peer.peer.close();
                    peer.peer = null;
                }
            }
        }
        /**
        * @type {Boolean}
        * @const
        */
        var invokedOnce = false;
        /**
        * @export
        */
        function selfInvoker() {
            if (invokedOnce) return;

            invokedOnce = true;

            if (isofferer) peer.addAnswerSDP(inner.sdp);
            else initPeer(inner.sdp);
        }
    }
    /**
    * @export
    */
    function leave() {
        /** @const*/
        var length = sockets.length;
        for (var i = 0; i < length; i++) {
            /**@const*/
            var socket = sockets[i];
            if (socket) {
                socket.send({
                    left: true,
                    userToken: self.userToken
                });
                delete sockets[i];
            }
        }

        // if owner leaves; try to remove his room from all other users side
        if (isbroadcaster) {
            defaultSocket.send({
                left: true,
                userToken: self.userToken,
                roomToken: self.roomToken
            });
        }

        if (config.attachStream) config.attachStream.stop();
    }

    window.addEventListener('beforeunload', function() {
        leave();
    }, false);

    window.addEventListener('keyup', function(e) {
        if (e.keyCode == 116)
            leave();
    }, false);
    /**
    * @param {*} transmitRoomOnce
    * @export
    */
    function startBroadcasting(transmitRoomOnce) {
        defaultSocket && defaultSocket.send({
            roomToken: self.roomToken,
            roomName: self.roomName,
            broadcaster: self.userToken
        });
        if (transmitRoomOnce) return;
        setTimeout(startBroadcasting, 3000);
    }
    /**
    * @param {*} channel
    * @export
    */
    function onNewParticipant(channel) {
        if (!channel || channels.indexOf(channel) != -1 || channel == self.userToken) return;
        channels += channel + '--';
        /** @const */
        var new_channel = uniqueToken();
        openSubSocket({
            channel: new_channel
        });

        defaultSocket.send({
            participant: true,
            userToken: self.userToken,
            joinUser: channel,
            channel: new_channel
        });
    }
    /**
    * @constructor
    * @export
    */
    function uniqueToken() {
        var s4 = function() {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

    openDefaultSocket();
    return {
        /**
        * @param {*} _config 
        * @export
        */
        createRoom: function(_config) {
            _config = _config || {};

            self.roomName = _config.roomName || 'Anonymous';
            self.roomToken = _config.roomToken || uniqueToken();

            if (_config.userToken) {
                self.userToken = _config.userToken;
            }

            isbroadcaster = true;
            isGetNewRoom = false;
            startBroadcasting(_config.transmitRoomOnce);
        },
        /**
        * @param {*} _config
        * @export
        */
        joinRoom: function(_config) {
            _config = _config || {};

            self.roomToken = _config.roomToken;
            isGetNewRoom = false;

            self.joinedARoom = true;
            self.broadcasterid = _config.joinUser;

            openSubSocket({
                channel: self.userToken
            });

            defaultSocket.send({
                participant: true,
                userToken: self.userToken,
                joinUser: _config.joinUser
            });
        },
        leaveRoom: leave
    };
};
