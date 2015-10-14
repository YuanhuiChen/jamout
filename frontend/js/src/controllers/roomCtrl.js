/**
 * Ctrl for displaying user profile details
 *
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomController');
goog.require('jamout.models.Room');


/**
 * Retrieve room details from backend for displaying
 *
 * @param $sce
 * @param $q
 * @param $scope
 * @param $rootScope
 * @param $http
 * @param $window
 * @param $location
 * @param {jamout.services.RoomService} roomService
 * @param {jamout.services.AudioVisualService} audioVisualService
 * @param {jamout.services.Socket} socket
 * @param {jamout.services.VideoStream} videoStream
 * @constructor
 */
jamout.controllers.RoomController = function( $sce, $q, $scope, $rootScope, $http, $window, $location, roomService, audioVisualService, socket, videoStream) {


     // Check for webrtc support

     if (!RTCPeerConnection ||!$window.navigator.getUserMedia) {
        /** @const */
        $scope.error = 'Please retry with the latest version of Chrome, Firefox or Opera to enable peer-2-peer video streaming.';
        return;
       }

    /**
     * Room Model to store & display data received from backend
     *
     * @expose
     * @type {jamout.models.Room}
     */
     $scope.roomModel = roomService.roomModel;

     /**
      * To store peers
      * @export 
      */
     $scope.peers = roomService.roomModel.peers;
     // $scope.peers = [];

     /**
      * Modal Header inside the modal directive for the Invite Btn
      * @export 
      */
     $scope.modalHeader = "Email, text or PM the following URL to invite friends";

     /**
      *  To store chat messages
      * @expose 
      */
     $scope.messages = [];

    /**
      * To store total users
      * @expose 
      */
     $scope.totalUsers = '';


      /**
      * @expose
      * @type {String}
      */
      $scope.header = '';

      /**
      * @expose 
      * @type {Object}
      */
      var socketModel = new Object();


      /** 
      * @expose
      */
      $scope.shareURL = $location.absUrl();
      //$window.console.log('room url', $scope.shareURL);


      /** @const */
      var room_path_id = $window.location.pathname;

      /** @const */
      var room_id = room_path_id.replace("/room/", "");
      socketModel['room_id'] =  room_id;

      // use for chat
      if ($window.sessionStorage['username']) 
      {
        roomService.roomModel.username = $window.sessionStorage['username'];
      } else {
        roomService.roomModel.username = "Guest";
        
      }

      


        roomService.GetDetails(room_path_id)
          .success(function(res, status, headers, config)
          {
            if (status == 200) {
           // window.console.log("Get Details success response");
            $scope.name = roomService.roomModel.creator;
            roomService.roomModel.creator = res['_creator'].username;
            roomService.roomModel.title = res.title;  
            $window.sessionStorage['res.creator.id'] = res['_creator']._id
            $window.sessionStorage['creatorStatus'] = false; 


            if (res.socket) 
            {
            roomService.roomModel.socket_room_id = res.socket;  // set socket id
            }

            //  Check if user is rooms creator and set its status
            //  todo: use a secure way of checking creator status in room as anyone can hack it 
            if ($window.sessionStorage['userid'] == $window.sessionStorage['res.creator.id']){
                //$window.console.log("CHECKING CREATOR STATUS");
                $window.sessionStorage['creatorStatus'] = true;          
            }

            $scope.header = roomService.roomModel.creator + "'s live cam - " + roomService.roomModel.title;  



            
            /** 
            *
            * INITIATE PEEER CONNECTION
            *
            */

                 // Check if user is rooms creator 
                 if ($window.sessionStorage['creatorStatus'] == "true") {
                    // $window.console.log("IN CREATOR BLOCK");
                      
                      // Begin request to get video stream 
                      videoStream.get()
                      .then(function (s) 
                      {

                        roomService.roomModel.stream = s;
                        roomService.init(roomService.roomModel.stream);

                        /***********************************
                        * Web audio api for audio processing
                        */
                        audioVisualService.setupAudioNode(roomService.roomModel.stream);
                        /** 
                        * End of web audio api
                        **********************/

                        /** 
                         * Create streams blob
                         * @const 
                         */
                        roomService.roomModel.stream = URL.createObjectURL(roomService.roomModel.stream);

                         // Check if user has already created the socket room
                        if (!sessionStorage['socket_room_id']) 
                        {
                          //console.log('THE ROOM DOESNT EXIST')
                          roomService.createSocketRoom()
                          /** 
                           *@param {*} roomId
                           */
                          .then(function (roomId) 
                          {
                             sessionStorage['socket_room_id'] = roomId;
                             roomService.roomModel.socket_room_id = roomId;
                             /** @const */
                             socketModel['id'] = roomId;
                               
                               /**
                               * Save the socket id to request later 
                               * Socket request
                               */
                               roomService.UpdateSocketId(socketModel)
                                  .success(function(res, status)
                                  {
                                    if (status == 200) {
                                  //  window.console.log("success update socket id");                
                                   }
                                  })
                                  .error(function(res,status)
                                  {
                                    window.console.log("error response for socketid");          
                                  });

                                });
                              } 
                              else 
                              {
                                // If the room socket_room_id already exists, request it
                                    roomService.GetSocketId(room_path_id)
                                      .success(function(res, status)
                                      {
                                        if (status == 200) {
                                       // window.console.log("success response for GET socket id", res);                
                                        roomService.joinRoom(res);
                                       }
                                      })
                                      .error(function(res,status)
                                      {
                                        window.console.log("error response for socketid");          
                                      });

                              }


                            }, function () {
                              $scope.error = 'No audio/video permissions. Please refresh your browser and allow audio/video capturing.';
                            });
                  


                    } 

                    else {
                       // IF the user is not the creator, request room socket id
                       // Alternative also check if the room is for video confernece.
                       // if video conferencing is true then request the users camera / otherwise skip it
                       console.log('get socket id');
                       roomService.GetSocketId(room_path_id)
                                      .success(function(res, status)
                                      {
                                        if (status == 200) {
                                        window.console.log("success response for GET socket id", res);                
                                        roomService.joinRoom(res);
                                       }
                                      })
                                      .error(function(res,status)
                                      {
                                        window.console.log("error response for socketid");          
                                      });
                          
                         }
                    
           
       }
  })
  .error(function(res,status,headers, config)
  {
    // window.console.log("error response")
            //$scope.error = 'Error: Invalid user or password';
            $window.location.href = '/profile';
    
  })

      
       /**
        * @expose
        * @constructor
        */
        $scope.getLocalVideo = function () {
            $window.console.log("get local video with stream");
             return $sce.trustAsResourceUrl(roomService.roomModel.stream);
        };
                


    // Socket Listeners for signalling

    socket.on('msg', function (message) 
      {
        //$window.console.log('message received', message);
        roomService.handleMessage(message);
      });
     
    
    /**
    * @param{*}
    * @param {Object}
    * @export
    */
    $scope.$on('peer:update', function (event, peer) {
     console.log('Client connected, adding new stream'); // 'Data to send'

      $scope.peers.push({
           id: peer.id,
          stream: URL.createObjectURL(peer.stream)
       }); 

    });


     socket.on('peer.connected', function (params) {
       // $window.console.log('Peer Connected');
       // $window.console.log('Peer Connected params', params);
      roomService.makeOffer(params['id']);
    });




    // TODO: When room creator leaves, the stream is not removed from viewers screen
     socket.on('peer.disconnected', function (peer) {      
      $window.console.log('Peer disconnected');

       $scope.peers = $scope.peers.filter( function (p){
         return  p.id !== peer.id; 
        });


      roomService.Disconnect(peer);

    });

      socket.on('peer.limit', function (message) {
       $window.console.log('Peer limit reached');  
       $scope.error = message.error;

    });

    socket.on('peer.totalusers', function (message) {
          /**
          * @export
          */
          var msg = roomService.handleViewers(message);
          $scope.totalUsers = msg;
    });

   /*****************end ********************************/


}

jamout.controllers.RoomController.INJECTS = ['$sce','$q','$scope', '$rootScope', '$http', '$window', '$location', 'roomService','audioVisualService' , 'socket','videoStream', jamout.controllers.RoomController];


