/**
 * This file defines functions for WebRTC signalling and roomCtrl requests
 * @fileoverview
 */
 
goog.provide('jamout.services.RoomService');
goog.require('jamout.models.Room');
goog.require('jamout.models.Chat');

/**
 *
 * @param {angular.$q} $q
 * @param {angular.$rootScope} $rootScope
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @param {angular.$timeout} $timeout
 * @param {jamout.services.Socket} socket
 * @constructor
 */

 jamout.services.RoomService = function($q, $rootScope, $http, $window, $timeout, socket)
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
    jamout.services.RoomService.window_ = $window;

    /** @expose */
    this.timeout_ = $timeout;
    
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

    /**
    * @expose
    * @type {jamout.models.Room}
    */
    this.chatModel = new jamout.models.Chat();
   
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
            'Authorization': 'Bearer ' + this.$window_.localStorage['token'],
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
 * @param {*} socketModel
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.UpdateSocketId= function(socketModel)
{
    //console.log('socket model', socketModel);  
    return this.$http_.post(jamout.services.RoomService.SOCKET_URL_API, socketModel,
      {
      /**@const */  
        headers: 
        {
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
 * @param {*} ROOM_PATH
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.RoomService.prototype.GetSocketId= function(ROOM_PATH)
{
    //console.log('room path is ', ROOM_PATH);
    return this.$http_.get(jamout.services.RoomService.SOCKET_GET_URL_API + ROOM_PATH,
      {
      /**@const */  
        headers: 
        {
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
 * Initiate Peer Connection
 * @param {*} id
 * @constructor
 */
jamout.services.RoomService.prototype.getPeerConnection = function(id) 
{
     
      jamout.services.RoomService.window_.console.log('getPeer Connection');

      if (jamout.services.RoomService.peerConnections[id]) {
        return jamout.services.RoomService.peerConnections[id];
      }

      
      var pc = new RTCPeerConnection(jamout.services.RoomService.iceConfig);
      jamout.services.RoomService.peerConnections[id] = pc;
      


         if (jamout.services.RoomService.roomModel.isCreator) {
            pc.addStream(jamout.services.RoomService.stream);
         }
 

      
      // console.log('stream', jamout.services.RoomService.stream);
      
      pc.onicecandidate = function (evnt) 
      {
       // console.log("inside ice candidate", evnt );
        if (evnt.candidate) {
       jamout.services.RoomService.socket.emit('peer:msg', { by:  jamout.services.RoomService.currentId, to: id, ice: evnt.candidate, type: 'ice' });
        } else {
         // console.log("end of candidate")
        }
      };

      // pc.oniceconnectionstatechange = jamout.services.RoomService.prototype.iceConnectionStateChange(event, pc);
      pc.oniceconnectionstatechange = function (evnt) 
      {
          // console.log ("checking ice state");
          // console.log("\n" + event.currentTarget.iceGatheringState);
          //console.log(' ICE state: ' + pc.iceConnectionState);
      }
      //console.log('after ice candidate');

      pc.onaddstream = function (event) 
      {
        //console.log('Received new stream', event);       
        //console.log('on add stream id', id);       
        if (id == 0) {      
            jamout.services.RoomService.roomModel.peer_stream = {
              id: id,
              stream: event.stream
            }

            jamout.services.RoomService.rootScope.$broadcast('peer:update', jamout.services.RoomService.roomModel.peer_stream);


          if (!jamout.services.RoomService.rootScope.$$digest) {
            jamout.services.RoomService.rootScope.$apply();
          }
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
  // console.log ("checking ice state");
  // console.log("\n" + event.currentTarget.iceGatheringState);
  // console.log(' ICE state: ' + pc.iceConnectionState);
  // console.log('ICE state change event: ', event);
};
/**
* @param {*} id
* @constructor
*/
jamout.services.RoomService.prototype.makeOffer = function(id) 
{
  var pc = jamout.services.RoomService.prototype.getPeerConnection(id);
  pc.createOffer(function (sdp) {
    pc.setLocalDescription(sdp);
    // console.log(sdp);
    // console.log('Creating an offer for', id);
    jamout.services.RoomService.socket.emit('peer:msg', { by:  jamout.services.RoomService.currentId, to: id, sdp: sdp, type: 'sdp-offer' });
  }, function (e) {
    // console.log(e);
  },
  { mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }});
}

/**
* Handle sdp for peer conndection
* @param {*} data
* @constructor
*/
jamout.services.RoomService.prototype.handleMessage = function(data) 
{
   // console.log("inside handleMessage data by", data.by);
  var pc = jamout.services.RoomService.prototype.getPeerConnection(data.by);
  // console.log(pc);
  // console.log(data);
  switch (data.type) {
    case 'sdp-offer':

      //update sdp for stereo audio quality ..
     data.sdp.sdp = jamout.services.RoomService.prototype.updateSDP(data.sdp);
  
      /** @const */
      var remoteDescription = new RTCSessionDescription(data.sdp);
      // console.log(remoteDescription); 
      pc.setRemoteDescription(remoteDescription, 
        function () 
      {
        console.log('Setting remote description by offer');
        pc.createAnswer(function (sdp) {
         // console.log('inside create Answer');
          pc.setLocalDescription(sdp);
          jamout.services.RoomService.socket.emit('peer:msg', { by:  jamout.services.RoomService.currentId, to: data.by, sdp: sdp, type: 'sdp-answer' });
        });
      }, 
      function (e) 
      {
         console.log("Could not set remote description. Reason " + e);
      });
      break;
    case 'sdp-answer':
    //update sdp for stero audio quality   
    data.sdp.sdp = jamout.services.RoomService.prototype.updateSDP(data.sdp);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
       // console.log('Setting remote description by answer');
      }, function (e) {
        console.error(e);
      });
      break;
    case 'ice':
      if (data.ice) {
       // console.log('Adding ice candidates');
        pc.addIceCandidate(new RTCIceCandidate(data.ice));
      }
      break;
  }
}


/**
 * @param {*} peer
 * @constructor
 */
jamout.services.RoomService.prototype.Disconnect = function(peer) 
{
       this.timeout_(function() {
        if (!jamout.services.RoomService.rootScope.$$digest) {
          jamout.services.RoomService.rootScope.$apply();
        }
      })

    };



//return api;
/**
* @param {*} r
* @constructor
*/
jamout.services.RoomService.prototype.joinRoom = function (r) 
{
    var socketcurrentid = JSON.parse(sessionStorage.getItem('socketCurrentid'));

      this.$window_.console.log("r is " + r);
    if (!jamout.services.RoomService.connected) {
        this.socket_.emit('room:init', { 'room': r,
                                    'currentId': socketcurrentid
                                  }, 
         function (roomid, id) {

          jamout.services.RoomService.currentId = id;
          sessionStorage['socket_room_id'] = roomid;  
         // sessionStorage['socketCurrentid'] = id;  
         });
      jamout.services.RoomService.connected = true;
      sessionStorage['socketconnected'] = true;  
   }
}



/**
* @constructor
*/

jamout.services.RoomService.prototype.createSocketRoom = function () 
{
    /** @expose */
    var d = this.$q_.defer();
    this.socket_.emit('room:init', null , function (roomid, id) {
     
     d.resolve(roomid);
      jamout.services.RoomService.currentId = id;
      jamout.services.RoomService.connected = true;

        sessionStorage['socket_room_id'] = roomid;  
        sessionStorage.setItem('socketCurrentid', JSON.stringify(id)); 
        sessionStorage['socketconnected'] = true;  

    });

   return d.promise;
}

/**
* For Chat-
* @param {String} message
* @constructor
*/
jamout.services.RoomService.prototype.sendMessage = function (message) 
{
    var socketcurrentid = JSON.parse(sessionStorage.getItem('socketCurrentid'));
    var socketRoomId = sessionStorage['socket_room_id'];

    if (jamout.services.RoomService.connected) {
   
        this.socket_.emit('chatMessage:send', { 
                                    'username' : this.roomModel.currentUser,
                                    'message' : message
                                  }); 
   } else {
     console.warn('socket not connected :/');
   }
}


/**
* @constructor
*/
jamout.services.RoomService.prototype.init = function (s)
{
    //this.$window_.console.log(s);
    jamout.services.RoomService.stream = s;
}




/**
* @constructor
*/
jamout.services.RoomService.prototype.ProvideRoomModel = function()
{
    return this.roomModel;    
}




/**
* @param {*} data
* @constructor
*/
jamout.services.RoomService.prototype.handleViewers = function(data) 
{

  // console.log("inside handle viewers", data);

    this.roomModel.viewers =  data.tallyUsers;

    switch(true) {
            case (this.roomModel.viewers === 0):
                return "";
                break;
            case (this.roomModel.viewers == 1): 
                return this.roomModel.viewers + " viewer";
                break;
             case (this.roomModel.viewers > 1): 
                return this.roomModel.viewers + " viewers";
                break;
            default:
                return"";
                break;
         }
}

/**
* Configure SDP for better better audio quality
* @param data
* @returns {Object}
* @constructor
*/
jamout.services.RoomService.prototype.updateSDP = function (data) {
 // console.log("inside update SDP");
 /** @type {Object} **/
  var SDP = data.sdp;
  /** @type {String} **/
  var SDPconfig = 'a=fmtp:111 stereo=1; sprop-stereo=1; cbr=1\r\n';   
  SDP = SDP.replace(/a=fmtp:111\sminptime=10;\suseinbandfec=1\r\n/g,  SDPconfig);  
  //console.log("updated SDP inside", SDP);
   return SDP;
}


/**
* Utility
* Sanitize user input 
* @param str
* @return {String}
* @constructor
*/
jamout.services.RoomService.prototype.sanitizeString = function (str) {

    str = str.replace(/[^a-z0-9áéíóúñü?!&* \.,_<-]/gim,"");
    return str.trim();

}

/**
* Utility
* Remove extram messages to keep the message array slim
* @param arr
* @return {Array}
* @constructor
*/
jamout.services.RoomService.prototype.removeExtraMessages = function (arr) {
   var l = arr.length;

  // console.log('array.length', l);
   if (l > 2) {
      return arr.splice(1,3);
   } else {
    return arr;
   }
}

jamout.services.RoomService.INJECTS =  ['$q', '$rootScope','$http', '$window', '$timeout', 'socket', jamout.services.RoomService];

