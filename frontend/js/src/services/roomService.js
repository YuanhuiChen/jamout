/**
 * This file defines functions for WebRTC signalling and roomCtrl requests
 * @fileoverview
 */
 
goog.provide('jamout.services.RoomService');
goog.require('jamout.models.Room');

/**
 *
 * @param {angular.$q} $q
 * @param {angular.$rootScope} $rootScope
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @param {jamout.services.Socket} socket
 * @constructor
 */

 jamout.services.RoomService = function($q, $rootScope, $http, $window, socket)
 {
	
    /** @expose */
    this.socket_ = socket;

    /** @expose */
    jamout.services.RoomService.socket = socket;

    /** @expose */
    this.$http_ = $http;

    /** @expose */
    this.$window_ = $window;

    /** @expose */
    jamout.services.RoomService.rootScope = $rootScope;

    /** @expose */
    this.$q_ = $q;

    /**
  	* @expose
  	* @type {jamout.models.Room}
  	*/
  	this.roomModel = new jamout.models.Room();

    /**
    * To access the model in the prototypes inneer function. this /lexical scope not working. wtf. laterr
    * @expose
    */
    jamout.services.RoomService.roomModel = this.roomModel;
   
}

/** @const */
jamout.services.RoomService.ROOM_URL = '/api';
/** @const */
jamout.services.RoomService.ROOM_CREATE_URL = '/api/room/create';
/** @const */
jamout.services.RoomService.SOCKET_GET_URL_API = '/api/socket'; 
/** @const */
jamout.services.RoomService.SOCKET_URL_API = '/api/socket/room'; 



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
 * Get Room Details
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.GetDetails = function(ROOM_PATH)
{
   
    return this.$http_.get(jamout.services.RoomService.ROOM_URL + ROOM_PATH,   
      {
      /**@const */  
        headers: 
        {
            //'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
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



/**
 * Update Room Socket ID in Room Model to make it accessible
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.UpdateSocketId= function(socketModel)
{
    console.log('socket model', socketModel);  
    return this.$http_.post(jamout.services.RoomService.SOCKET_URL_API, socketModel,
      {
      /**@const */  
        headers: 
        {
            //'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
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



/**
 * Update Room Socket ID in Room Model to make it accessible
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.GetSocketId= function(ROOM_PATH)
{
    console.log('room path is ', ROOM_PATH);
    return this.$http_.get(jamout.services.RoomService.SOCKET_GET_URL_API + ROOM_PATH,
      {
      /**@const */  
        headers: 
        {
            //'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
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


//=========================================>WEBRTC RELATED<============================================

/** @expose */
jamout.services.RoomService.iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
/** @expose */
jamout.services.RoomService.peerConnections = {};

/** @expose */
jamout.services.RoomService.currentId = ''; 
/** @expose */
jamout.services.RoomService.roomId = '';
/** @expose */
jamout.services.RoomService.stream = '';
/** @expose */
jamout.services.RoomService.connected = false ;
sessionStorage['socketconnected'] = false;  


/**
 * @param {*} id
 * @constructor
 */
jamout.services.RoomService.prototype.getPeerConnection = function(id) {


      if (jamout.services.RoomService.peerConnections[id]) {
        return jamout.services.RoomService.peerConnections[id];
      }
      var pc = new RTCPeerConnection(jamout.services.RoomService.iceConfig);
      jamout.services.RoomService.peerConnections[id] = pc;

      pc.addStream(jamout.services.RoomService.stream);

      console.log('outside ice candidate');
      console.log('stream', jamout.services.RoomService.stream);
      
      pc.onicecandidate = function (evnt) {
        console.log("inside ice candidate", evnt );
        if (evnt.candidate) {
       jamout.services.RoomService.socket.emit('msg', { by: sessionStorage['socketCurrentid'], to: id, ice: evnt.candidate, type: 'ice' });
        } else {
          console.log("end of candidate")
        }
      };

      // pc.oniceconnectionstatechange = jamout.services.RoomService.prototype.iceConnectionStateChange(event, pc);
      pc.oniceconnectionstatechange = function (evnt) {
          console.log ("checking ice state");
          console.log("\n" + event.currentTarget.iceGatheringState);
          //console.log(' ICE state: ' + pc.iceConnectionState);
      }
      console.log('after ice candidate');

      pc.onaddstream = function (event) {
        console.log('Received new stream', event);       
        jamout.services.RoomService.roomModel.peer_stream = {
          id: id,
          stream: event.stream
        }

      jamout.services.RoomService.rootScope.$broadcast('peer:update', jamout.services.RoomService.roomModel.peer_stream);


        if (!jamout.services.RoomService.rootScope.$$digest) {
          jamout.services.RoomService.rootScope.$apply();
        }

      };
      return pc;
    }


/**
* Check state ICE state
* @param {*} event
* @param {*} pc
* @constructor
*/
jamout.services.RoomService.prototype.iceConnectionStateChange = function (event, pc){
  console.log ("checking ice state");
  console.log("\n" + event.currentTarget.iceGatheringState);
  console.log(' ICE state: ' + pc.iceConnectionState);
  console.log('ICE state change event: ', event);
};
/**
* @param {*} id
* @constructor
*/
jamout.services.RoomService.prototype.makeOffer = function(id) {
  var pc = jamout.services.RoomService.prototype.getPeerConnection(id);
  pc.createOffer(function (sdp) {
    pc.setLocalDescription(sdp);
    console.log(sdp);
    console.log('Creating an offer for', id);
    jamout.services.RoomService.socket.emit('msg', { by: sessionStorage['socketCurrentid'], to: id, sdp: sdp, type: 'sdp-offer' });
  }, function (e) {
    console.log(e);
  },
  { mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }});
}

/**
* @param {*} data
* @constructor
*/
jamout.services.RoomService.prototype.handleMessage = function(data) {
  console.log("inside handleMessage");
  var pc = jamout.services.RoomService.prototype.getPeerConnection(data.by);
  console.log(pc);
  console.log(data);
  switch (data.type) {
    case 'sdp-offer':

      console.log("inside sdp offer");
      console.log(data.sdp);

      /** @const */
      var remoteDescription = new RTCSessionDescription(data.sdp);
      console.log(remoteDescription); 
      pc.setRemoteDescription(remoteDescription, 
        function () 
      {
        console.log('Setting remote description by offer');
        pc.createAnswer(function (sdp) {
          console.log('inside create Answer');
          pc.setLocalDescription(sdp);
          jamout.services.RoomService.socket.emit('msg', { by: sessionStorage['socketCurrentid'], to: data.by, sdp: sdp, type: 'sdp-answer' });
        });
      }, 
      function (e) 
      {
          console.log("Could not set remote description. Reason " + e);
      });
      break;
    case 'sdp-answer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        console.log('Setting remote description by answer');
      }, function (e) {
        console.error(e);
      });
      break;
    case 'ice':
      if (data.ice) {
        console.log('Adding ice candidates');
        pc.addIceCandidate(new RTCIceCandidate(data.ice));
      }
      break;
  }
}


/**
 * @param {*} socket
 * @constructor
 */
jamout.services.RoomService.prototype.Disconnect = function() {

        if (!jamout.services.RoomService.rootScope.$$digest) {
          jamout.services.RoomService.rootScope.$apply();
        }
    };



//return api;
/**
* @constructor
*/
jamout.services.RoomService.prototype.joinRoom = function (r) {
    if (!jamout.services.RoomService.connected) {
        this.$window_.console.log("r is " + r);
        this.socket_.emit('init', { room: r
                                    // ,
                                    // name: this.roomModel.username
                                  }, 
         function (roomid, id) {
          // jamout.services.RoomService.roomId = roomid;
          // jamout.services.RoomService.currentId = id;

          sessionStorage['socket_room_id'] = roomid;  
          sessionStorage['socketCurrentid'] = id;  

          console.log('id is ', id);
          console.log('roomid is', roomid );
      });
      jamout.services.RoomService.connected = true;
      sessionStorage['socketconnected'] = true;  
   }
}


/**
* @constructor
*/

jamout.services.RoomService.prototype.createSocketRoom = function () {
    /** @expose */
    var d = this.$q_.defer();
    this.socket_.emit('init', null, function (roomid, id) {
     
    console.log(roomid);
     d.resolve(roomid);
     // jamout.services.RoomService.roomId = roomid;
      // jamout.services.RoomService.currentId = id;
      // jamout.services.RoomService.connected = true;

        sessionStorage['socket_room_id'] = roomid;  
        sessionStorage['socketCurrentid'] = id;  
        sessionStorage['socketconnected'] = true;  
        console.log("Inside createRoom socket");
        console.log(id);
        console.log(roomid);

    });

   return d.promise;
}

/**
* @constructor
*/
jamout.services.RoomService.prototype.init = function (s) {
    this.$window_.console.log("Inside init");
    this.$window_.console.log(s);
    jamout.services.RoomService.stream = s;
}




/**
* @constructor
*/
jamout.services.RoomService.prototype.ProvideRoomModel = function()
{
    return this.roomModel;    
}


jamout.services.RoomService.INJECTS =  ['$q', '$rootScope','$http', '$window', 'socket', jamout.services.RoomService];

