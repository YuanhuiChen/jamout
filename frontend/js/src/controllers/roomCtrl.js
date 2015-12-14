/**
 * Ctrl for displaying user profile details
 *
 * @fileoverview
 */

goog.provide('jamout.controllers.RoomController');
goog.require('jamout.models.Room');
goog.require('jamout.models.Chat');


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
        $scope.error = 'Please retry with the latest version of Chrome, Firefox or Opera on a PC or an Android device.';
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
     * For chat messages
     *
     * @expose
     * @type {jamout.models.Chat}
     */
     $scope.chatModel = roomService.chatModel;

     /**
      *  To store and display chat messages & room updates
      * @expose 
      */
     $scope.messages = roomService.chatModel.messages;

     /**
      * To store peers
      * @export 
      */
     $scope.peers = roomService.roomModel.peers;
    

     /**
      * Modal Header inside the modal directive for the Invite Btn
      * @export 
      */
     $scope.modalHeader = "Copy & share the private URL with friends you would like to join.";

 


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
      $scope.roomURL = $location.absUrl();
      //$window.console.log('room url', $scope.shareURL);


      /** @const */
      var room_path_id = $window.location.pathname;

      /** @const */
      var room_id = room_path_id.replace("/room/", "");

      socketModel['room_id'] =  room_id;

     /**
      * To toggle chat if the username exists
      * @export 
      */
     $scope.showChat = true;

     socket.on('connect', function () 
      {
        //$window.console.log('A new socket has connected', socket);
        // Store socketSessionId to authenticate current user on user:update
        roomService.roomModel.socketSessionId = socket.socket.io.engine.id;
      
      });

     // check if username already exists
      if ($window.sessionStorage['username']) 
      {
       roomService.roomModel.currentUser = $window.sessionStorage['username'];
      } else { 
         $scope.showChat = !$scope.showChat;
      }

      /**
      * To set participants username
      * @type {Object} model
      * @export
      */
      $scope.setUsername = function (model) {
          //clean up and trim username
        if (model.username !== undefined) {
          if (angular.isObject(model)) {
             var username = roomService.sanitizeString(model.username);
             socket.emit('username:update', {username: username,
                                             id : roomService.roomModel.socketSessionId });
             $scope.showChat = !$scope.showChat;
          }
        }  
      }



        roomService.GetDetails(room_path_id)
          .success(function(res, status, headers, config)
          {
            if (status == 200) {
            // console.log("Get Details success response");
            // console.log('res', res);
            roomService.roomModel.url = res['_creator'].url;

            roomService.roomModel.creatorUsername = res['_creator'].username;
            roomService.roomModel.title = res.title;  
            $scope.user = roomService.roomModel.creatorUsername;
            $scope.title = roomService.roomModel.title;
            $scope.url = roomService.roomModel.url;
            $window.sessionStorage['res.creator.id'] = res['_creator']._id

            if (res.socket) 
            {
            roomService.roomModel.socket_room_id = res.socket;  // set socket id
            }



            //  Check if user is rooms creator and set its status
            //  todo: use a secure way of checking creator status in room as anyone can hack it 
            if ($window.sessionStorage['userid'] == $window.sessionStorage['res.creator.id']){

                roomService.roomModel.isCreator = true;         
            }

            $scope.header = roomService.roomModel.creatorUsername + "'s LIVE CAM - " + roomService.roomModel.title; 
            $scope.inviteTEXT =  roomService.roomModel.creatorUsername + ' is streaming ' + '"' + roomService.roomModel.title + '"' + " live on #JamOut: ";

            
            /** 
            *
            * INITIATE PEEER CONNECTION
            *
            */

                 // Check if user is rooms creator 
                 if (roomService.roomModel.isCreator) {
                    // $window.console.log("IN CREATOR BLOCK");
                      $scope.error = "Please allow Jamout to access your camera and microphone.";
                      // Begin request to get video stream 
                      videoStream.get()
                      .then(function (s) 
                      {
                        $scope.error="";
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

                        if (!roomService.roomModel.socket_room_id) 
                        {
                          // console.log('THE ROOM DOESNT EXIST')
                          roomService.createSocketRoom()
                          .then(function (roomId) 
                          { 
                            // console.log('the socket room id is', roomId);
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
                                // If the room socket_room_id already exists, request it
                                    roomService.GetSocketId(room_path_id)
                                      .success(function(res, status)
                                      {
                                        // window.console.log("GET socket id success response for ", res);
                                        // window.console.log("GET socket id success response for ", status);
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
                       // Future: IF the user is not the creator, request room socket id
                       // Alternative also check if the room is for video confernece.
                       // if video conferencing is true then request the users camera / otherwise skip it
                       //console.log('get socket id');
                       roomService.GetSocketId(room_path_id)
                                      .success(function(res, status)
                                      {
                                        if (status == 200) {
                                        // window.console.log("success response for GET socket id", res);
                                        
                                            if (res) {                
                                              roomService.joinRoom(res);
                                             }
                                       }
                                      })
                                      .error(function(res,status)
                                      {
                                        window.console.log("error response for socketid");
                                        $scope.error = "The stream does not exist. Please make sure the URL is correct and retry.";          
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
            // $window.console.log("get local video with stream");
             return $sce.trustAsResourceUrl(roomService.roomModel.stream);
        };
                


    // Socket Listeners for signalling

     

    socket.on('peer:msg', function (message) 
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
     // console.log('Client connected, adding new stream'); // 'Data to send'

      $scope.peers.push({
           id: peer.id,
          stream: URL.createObjectURL(peer.stream)
       }); 

    });


     socket.on('peer:connected', function (params) {
       // $window.console.log('Peer Connected');
       // $window.console.log('Peer Connected params', params);
      roomService.makeOffer(params['id']);
    });




    // TODO: When room creator leaves, the stream is not removed from viewers screen
     socket.on('peer:disconnected', function (peer) {      
      $window.console.log('Peer disconnected');

       $scope.peers = $scope.peers.filter( function (p){
         return  p.id !== peer.id; 
        });


      roomService.Disconnect(peer);

    });

      socket.on('peer:limit', function (message) {
       // $window.console.log('Peer limit reached');  
       $scope.error = message.error;

    });

    socket.on('peer:totalusers', function (message) {
          /**
          * @export
          */
          var msg = roomService.handleViewers(message);
          $scope.totalUsers = msg;
    });

// socket chat
    $scope.sendMessage = function (chatModel) {
    // console.log('chat model message', chatModel);
    // console.log('chat model message', chatModel.message);
    if (chatModel.message !== undefined) {
      var Message = roomService.sanitizeString(chatModel.message);
       roomService.sendMessage(Message);
       // clear input field
       $scope.chatModel.message = "";
      } else {
        $window.alert("Please make sure the text message is not tooo long");
      }
    } 

    
     socket.on('chatMessage:receive', function (message) {
     // console.log('received new message', message)
    if (angular.isObject(message)) {
       $scope.messages.push(message);
       $scope.messages = roomService.removeExtraMessages($scope.messages);
       
      }
    });

    socket.on('user:joined', function (data) {
      console.log('new user', data.username);

      if (angular.isObject(data)) {
        //set current user by checking socket session id with the id received from server
         if (roomService.roomModel.socketSessionId === data.id) {
            roomService.roomModel.currentUser = data.username;
            // console.log('new user', roomService.roomModel.currentUser);

        }

         //var m = data.username + ' just joined';
         var update = { username :  data.username,
                        message :  data.message}
         $scope.messages.push(update);
     }
    });
   /*****************end ********************************/

   /** twitter btn **/
   twttr.ready(
  function (twttr) {
    // bind events here
     twttr.widgets.createShareButton(
      $scope.roomURL,
       document.getElementById('tweetBtn'),
      {
             text: 'Come through!',
             count: 'none',
             size: 'large',
             hashtags: 'JamOut, live, cam'
              }
      ).then( function( el ) {
      // console.log('Tweet button added.');
    });
  }
);


}

jamout.controllers.RoomController.INJECTS = ['$sce','$q','$scope', '$rootScope', '$http', '$window', '$location', 'roomService','audioVisualService' , 'socket','videoStream', jamout.controllers.RoomController];


