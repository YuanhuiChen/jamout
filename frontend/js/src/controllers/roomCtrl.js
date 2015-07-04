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

		//$window.console.log(socket);
		

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
      $window.console.log(room_path_id);
      /** @const */
      var room_id = room_path_id.replace("/room/", "");
      $window.console.log(room_id);
      $window.sessionStorage['room_id'] = room_id;
      $window.console.log($window.navigator.getUserMedia);

      // //check session storage
      // //creator / user
      if ($window.sessionStorage['username']) {
        roomService.roomModel.username = $window.sessionStorage['username'];
      } else {
        roomService.roomModel.username = "Guest";

      }

      // request details through the service
        roomService.GetDetails(room_path_id)
          .success(function(res, status, headers, config)
          {
            if (status == 200) {

            window.console.log("success response");
            window.console.log(res);

            //store the username from the backend
            window.console.log(res['_creator']);

            roomService.roomModel.creator = res['_creator'].username;
            $scope.name = roomService.roomModel.creator;
            roomService.roomModel.title = res.title;  // set room title
            
            $scope.header = roomService.roomModel.creator + "'s Cam - " + roomService.roomModel.title;  
            window.console.log($location.url());      
              
           }
          })
          .error(function(res,status,headers, config)
          {
            window.console.log("error response")
            /**
                       * TODO: Handle redirect with backend error handler
                       */
                    // Handle view error here
                    //$scope.error = 'Error: Invalid user or password';
                    $window.location.href = '/profile';
            
          })


    // Socket Listeners
     // ================= add rtcpeerconnection
     if (!$window.navigator.getUserMedia) {
        /** @const */
        $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
        return;
       }

   /** @export */
   var stream;


      socket.on('msg', function (message, cb) {
        $window.console.log('message received');
        $window.console.log(message);
        //$scope.messages.push(message);
        roomService.handleMessage(message);
      });

    //For broadcasting:
    //add creater value to true
    //if creator = get video constraints
    //if creator = false,  do not get video constraints. (can possibly just directly join without calling the videoStream.get()
    //slave can only join room and can't create it
    

    // check room creator status... if (sessionstorage[user] == user.creator )
    // true if creator or undefined
    $window.console.log('room creator status: ', $window.sessionStorage['room_creator']);
    // If room creator (check room creator status)
    videoStream.get()
    .then(function (s) 
    {
      roomService.roomModel.stream = s;
      console.log("video stream get");        
      console.log(s);        
      roomService.init(roomService.roomModel.stream);
      /** @const */
      roomService.roomModel.stream = URL.createObjectURL(roomService.roomModel.stream);

      if (!localStorage['socket_room_id']) 
      {
        console.log('THE ROOM DOESNT EXIST')
        roomService.createSocketRoom()
        .then(function (roomId) 
        {
         //persist this data on backend or ? 
           localStorage['socket_room_id'] = roomId;
           roomService.roomModel.socket_room_id = roomId;

           socketModel.id = roomId;
           socketModel.room_id =  room_id;

           console.log('socket_model', socketModel);
           console.log($window.localStorage['socket_room_id']);
          // console.log("back from create room: ");

            roomService.UpdateSocketId(socketModel)
              .success(function(res, status)
              {
                if (status == 200) {
                window.console.log("success response for socket id");                
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
        roomService.joinRoom(localStorage['socket_room_id']);
      }


    }, function () {
      $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });
   
   // else repeat the above block of code.. again? 

    /**
     * @expose
     * @constructor
     */
    $scope.getLocalVideo = function () {
        $window.console.log("get local video with stream: " + roomService.roomModel.stream);
         return $sce.trustAsResourceUrl(roomService.roomModel.stream);
    };


    /** @export */
    $scope.peers = [];
    /** expose */
    $scope.messages = [];

    
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
     $window.console.log($scope.peers);

    });


     socket.on('peer.connected', function (params) {
      roomService.makeOffer(params.id);
       $window.console.log('Peer Connected');
       $window.console.log(params.id);
    });

    
     socket.on('peer.disconnected', function (peer) {
      $window.console.log('Client disconnected, removing stream');
      roomService.Disconnect(peer);
      $scope.peers = $scope.peers.filter(function (p) {
        return p.id !== peer.id;
      });
    });



   /*****************end ********************************/
      

}

jamout.controllers.RoomController.INJECTS = ['$sce','$q','$scope', '$rootScope', '$http', '$window', '$location', 'roomService', 'socket','videoStream', jamout.controllers.RoomController];


