/**
 * Broadcast logic
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
var broadcast = function(config) {
    /** @const */
    var self = {
        userToken: uniqueToken()
    },
        channels = '--',
        isbroadcaster,
        isGetNewRoom = true,
        participants = 1,
        defaultSocket = { };
    /**
     * @export
     */
    function openDefaultSocket() {
        defaultSocket = config.openSocket({
            onmessage: onDefaultSocketResponse,
            /**
            * @param (*) socket
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

        if (response.userToken && response.joinUser == self.userToken && response.participant && channels.indexOf(response.userToken) == -1) {
            channels += response.userToken + '--';
            openSubSocket({
                isofferer: true,
                channel: response.channel || response.userToken,
                closeSocket: true
            });
        }
    }
    /**
    * @param {*} _config
    * @export
    */
    function openSubSocket(_config) {
        if (!_config.channel) return;
        /** @const */
        var socketConfig = {
            channel: _config.channel,
            onmessage: socketResponse,
            /**
            * @export
            */
            onopen: function() {
                if (isofferer && !peer) initPeer();
            }
        };
        /**
        *@param {*} _socket
        *@export
        */
        socketConfig.callback = function(_socket) {
            socket = _socket;
            this.onopen();
        };
        /** @const */
        var socket = config.openSocket(socketConfig),
            isofferer = _config.isofferer,
            gotstream,
            htmlElement = document.createElement(self.isAudio ? 'audio' : 'video'),
            inner = { },
            peer;
        /** @const */    
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

                htmlElement[moz ? 'mozSrcObject' : 'src'] = moz ? stream : webkitURL.createObjectURL(stream);
                htmlElement.play();

                _config.stream = stream;
                if (self.isAudio) {
                    htmlElement.addEventListener('play', function() {
                        this.muted = false;
                        this.volume = 1;
                        afterRemoteStreamStartedFlowing();
                    }, false);
                } else onRemoteStreamStartsFlowing();
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
        function onRemoteStreamStartsFlowing() {
            if(navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i)) {
                // if mobile device
                return afterRemoteStreamStartedFlowing();
            }
            
            if (!(htmlElement.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || htmlElement.paused || htmlElement.currentTime <= 0)) {
                afterRemoteStreamStartedFlowing();
            } else setTimeout(onRemoteStreamStartsFlowing, 50);
        }
        /**
        * @export
        */
        function afterRemoteStreamStartedFlowing() {
            gotstream = true;
            config.onRemoteStream(htmlElement);

            /* closing subsocket here on the offerer side */
            if (_config.closeSocket) socket = null;
        }
        /**
        * @param {*} sdp
        * @export
        */
        function sendsdp(sdp) {
            sdp = JSON.stringify(sdp);
            /** @const */
            var part = parseInt(sdp.length / 3);
            /** @const */
            var firstPart = sdp.slice(0, part),
                secondPart = sdp.slice(part, sdp.length - 1),
                thirdPart = '';

            if (sdp.length > part + part) {
                secondPart = sdp.slice(part, part + part);
                thirdPart = sdp.slice(part + part, sdp.length);
            }

            socket.send({
                userToken: self.userToken,
                firstPart: firstPart
            });

            socket.send({
                userToken: self.userToken,
                secondPart: secondPart
            });

            socket.send({
                userToken: self.userToken,
                thirdPart: thirdPart
            });
        }
        /**
        * @param {*} response
        * @export
        */
        function socketResponse(response) {
            if (response.userToken == self.userToken) return;
            if (response.firstPart || response.secondPart || response.thirdPart) {
                if (response.firstPart) {
                    inner.firstPart = response.firstPart;
                    if (inner.secondPart && inner.thirdPart) selfInvoker();
                }
                if (response.secondPart) {
                    inner.secondPart = response.secondPart;
                    if (inner.firstPart && inner.thirdPart) selfInvoker();
                }

                if (response.thirdPart) {
                    inner.thirdPart = response.thirdPart;
                    if (inner.firstPart && inner.secondPart) selfInvoker();
                }
            }

            if (response.candidate && !gotstream) {
                peer && peer.addICE({
                    sdpMLineIndex: response.candidate.sdpMLineIndex,
                    candidate: JSON.parse(response.candidate.candidate)
                });
            }
        }
        /** @const */
        var invokedOnce = false;
        /**
        * @export
        */
        function selfInvoker() {
            if (invokedOnce) return;

            invokedOnce = true;

            inner.sdp = JSON.parse(inner.firstPart + inner.secondPart + inner.thirdPart);
            if (isofferer) {
                peer.addAnswerSDP(inner.sdp);
                if (config.onNewParticipant) config.onNewParticipant(participants++);
            } else initPeer(inner.sdp);
        }
    }
    /**
    * @export
    */
    function startBroadcasting() {
        defaultSocket && defaultSocket.send({
            roomToken: self.roomToken,
            roomName: self.roomName,
            broadcaster: self.userToken,
            isAudio: self.isAudio
        });
        setTimeout(startBroadcasting, 3000);
    }
    /**
    * @export
    */
    function uniqueToken() {
        /** @const */
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
            self.roomName = _config.roomName || 'Anonymous';
            self.isAudio = _config.isAudio;
            self.roomToken = uniqueToken();

            isbroadcaster = true;
            isGetNewRoom = false;
            startBroadcasting();
        },
        /**
        * @param {*} _config
        * @export
        */
        joinRoom: function(_config) {
            self.roomToken = _config.roomToken;
            self.isAudio = _config.isAudio;
            isGetNewRoom = false;

            openSubSocket({
                channel: self.userToken
            });

            defaultSocket.send({
                participant: true,
                userToken: self.userToken,
                joinUser: _config.joinUser
            });
        }
    };
};