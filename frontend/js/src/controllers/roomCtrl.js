/**
 * Ctrl for displaying user profile details
 *
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomController');
goog.require('jamout.models.Room');

// TODO TRY ROUTESPARAM BY INSTALLING NGROUTE
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
 * @param {jamout.services.Socket} socket
 * @param {jamout.services.VideoStream} videoStream
 * @constructor
 */
jamout.controllers.RoomController = function( $sce, $q, $scope, $rootScope, $http, $window, $location, roomService, socket, videoStream) {


     // Check for webrtc support
     if (!$window.RTCPeerConnection ||!$window.navigator.getUserMedia) {
        /** @const */
        $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
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
      * @expose
      * @type {String}
      */
      $scope.header = '';


      /**
      * @expose 
      * @type {Object}
      */
      var socketModel = new Object();


      /** @const */
      var room_path_id = $window.location.pathname;

      /** @const */
      var room_id = room_path_id.replace("/room/", "");
      socketModel.room_id =  room_id;

      // 
      if ($window.sessionStorage['username']) 
      {
        roomService.roomModel.username = $window.sessionStorage['username'];
      } else {
        roomService.roomModel.username = "Guest";
        
      }

      // request details through the service
        roomService.GetDetails(room_path_id)
          .success(function(res, status, headers, config)
          {
            if (status == 200) {
            window.console.log("Get Details success response");
            // window.console.log("res is", res);
            // window.console.log("res creator is", res['_creator']);
            // window.console.log("res creator id is", res['_creator']._id);
            $scope.name = roomService.roomModel.creator;
            roomService.roomModel.creator = res['_creator'].username;
            roomService.roomModel.title = res.title;  
            $window.sessionStorage['res.creator.id'] = res['_creator']._id
            $window.sessionStorage['creatorStatus'] = false; 
            
            if (res.socket) 
            {
            roomService.roomModel.socket_room_id = res.socket;  // set socket id
            }

            // // // todo: use a secure way of checking creator status in room 
            if ($window.sessionStorage['userid'] == $window.sessionStorage['res.creator.id']){
                $window.console.log("CHECKING CREATOR STATUS");
                $window.sessionStorage['creatorStatus'] = true;          
            }

            $scope.header = roomService.roomModel.creator + "'s Cam - " + roomService.roomModel.title;  
                 
           
       }
  })
  .error(function(res,status,headers, config)
  {
    // window.console.log("error response")
            //$scope.error = 'Error: Invalid user or password';
            $window.location.href = '/profile';
    
  })

                


              // Socket Listeners
             // ================= add rtcpeerconnection

             /** @export */
             var stream;

              //For broadcasting:

                      $window.console.log("IN CREATOR BLOCK");
                      videoStream.get()
                      .then(function (s) 
                      {
                        roomService.roomModel.stream = s;
                        roomService.init(roomService.roomModel.stream);
                        /** @const */
                        roomService.roomModel.stream = URL.createObjectURL(roomService.roomModel.stream);

                        if (!roomService.roomModel.socket_room_id) 
                        {
                          console.log('THE ROOM DOESNT EXIST')
                          roomService.createSocketRoom()
                          .then(function (roomId) 
                          {
                             sessionStorage['socket_room_id'] = roomId;
                             roomService.roomModel.socket_room_id = roomId;
                             socketModel.id = roomId;
                               roomService.UpdateSocketId(socketModel)
                                  .success(function(res, status)
                                  {
                                    if (status == 200) {
                                    window.console.log("success update socket id");                
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
                                // get socket id from api 
                                    roomService.GetSocketId(room_path_id)
                                      .success(function(res, status)
                                      {
                                        if (status == 200) {
                                        window.console.log("success response for GET socket id");                
                                        roomService.joinRoom(res);
                                       }
                                      })
                                      .error(function(res,status)
                                      {
                                        window.console.log("error response for socketid");          
                                      });

                              }


                            }, function () {
                              $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
                            });
                    


                          
                    // videoStream.get()
                    //   .then(function () 
                    //   { 
                    //           window.console.log('Inside viewer block');
                    //           roomService.GetSocketId(room_path_id)
                    //             .success(function(res, status)
                    //             {
                    //               if (status == 200) {
                    //               window.console.log("success response for GET socket id");                
                    //               roomService.joinRoom(res);
                    //              }
                    //             })
                    //             .error(function(res,status)
                    //             {
                    //               window.console.log("error response for socketid");          
                    //             });

                    //   }, function () {
                    //     $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
                    //   });


     /**
      * @expose
      * @constructor
      */
    $scope.getLocalVideo = function () {
        $window.console.log("get local video with stream");
         return $sce.trustAsResourceUrl(roomService.roomModel.stream);
    };


    /** @export */
    $scope.peers = [];
    /** expose */
    $scope.messages = [];


    socket.on('msg', function (message, cb) 
      {
        $window.console.log('message received');
        $window.console.log(message);
        roomService.handleMessage(message);
      });
     
    
    /**
    * @param{*}
    * @param {Object}
    * @export
    */
    $scope.$on('peer:update', function (event, peer) {
     console.log('Client connected, adding new stream'); // 'Data to send'
     console.log('peer', peer); // 'Data to send'
     console.log('peer id', peer.id); // 'Data to send'
     
     // only add the first peer

      $scope.peers.push({
             id: peer.id,
             stream: URL.createObjectURL(peer.stream)
        });
     
     $window.console.log($scope.peers);

    });


     socket.on('peer.connected', function (params) {
       $window.console.log('Peer Connected');
      roomService.makeOffer(params.id);
       $window.console.log(params.id);
    });

    
     socket.on('peer.disconnected', function (peer) {
      $window.console.log('Client disconnected, removing stream');
      roomService.Disconnect(peer);
      $scope.peers = $scope.peers.filter(function (p) {
        return p.id !== peer.id;
      });
    });

      socket.on('peer.limit', function (message) {
       $window.console.log('Peer limit reached');  
       $scope.error = message.error;

    });


   /*****************end ********************************/
      

}

jamout.controllers.RoomController.INJECTS = ['$sce','$q','$scope', '$rootScope', '$http', '$window', '$location', 'roomService', 'socket','videoStream', jamout.controllers.RoomController];


