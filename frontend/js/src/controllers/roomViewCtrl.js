/**
 * Todo Ctrl
 * Start after room module works well on a single page
 * Service for anonymous user
 * This will serve as a landing page with a live stream and limited interaction
 *
 * @fileoverview
 */
 

goog.provide('jamout.controllers.RoomViewController');
goog.require('jamout.models.RoomView');


/**
 * Handles profile page details
 *
 * @param $scope
 * @param $http
 * @param $window
 * @param $location
 * @param {jamout.services.RoomViewService} roomViewService
 * @param {jamout.services.AuthService} authService
 * @param {jamout.services.Socket} socket
 * @constructor
 */
jamout.controllers.RoomViewController = function($scope, $http, $window, $location, roomViewService, authService, socket) {

    $window.console.log(socket);
     /**
     * @expose
     * @type {String}
     */
    $scope.header = '';


    // Socket Listeners
     // =================

    // socket.on('init', function (data) {
    //     $window.console.log('A user joined!', data.name);
    //     $window.console.log('A user joined!', data.users);
    //      /**@type {String} */
    //       $scope.name = data.name;
    //       /**
    //        *@export
    //        *@type {Array} 
    //        */
    //      $scope.users = data.users;
    //       $window.console.log('usersss!', $scope.users);
    //   });

      socket.on('send:message', function (message, cb) {
        $window.console.log('A msg received');
        $scope.messages.push(message);
      });



      socket.on('user:join', function (data) {
        $window.console.log('A new user joined!', data.name);
        $scope.messages.push({
          user: 'chatroom',
          text: 'User ' + data.name + ' has joined.'
       });
        //$scope.users = [];
        $scope.users.push(data.name);
      });


     // add a message to the conversation when a user disconnects or leaves the room
      socket.on('user:left', function (data) {
        $window.console.log('A new user left!');
        $scope.messages.push({
          user: 'chatroom',
          text: 'User ' + data.name + ' has left.'
       });
       var i, user;
        for (i = 0; i < $scope.users.length; i++) {
         user = $scope.users[i];
         if (user === data.name) {
            $scope.users.splice(i, 1);
            break;
         }
       }
     });
      
      // Private helpers
     // ===============
      // Methods published to the scope
       // ==============================

      /**
      * @expose
      * @type {sendMessage}
      */
        $scope.sendMessage = function () 
        { 
          $window.console.log('MESSAGE SENT')
        socket.emit('send:message', {
          message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
          user: $scope.name,
          text: $scope.message
        });
        console.log('This is a message' + $scope.message);
        // clear message box
        $scope.message = '';
      };

      
      /**
      * @export
      * @type {Array}
      */
       $scope.messages = [];
       /**
       *@export
       *@type {Array} 
       */
      $scope.users = [];
       
       /**@type {String} */
       $scope.message = ''

    

    // $scope.newChannel = function (socket) {
    // // todo publish this method to the scope?
    // socket.emit('new-channel', {
  //              channel: roomService.roomModel.id,
  //              sender: roomService.roomModel.username
  //        });
   //    };
    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

    ///api/room/:id
    /** @const */
    var room_path_id = $window.location.pathname;
    $window.console.log(room_path_id)


    roomViewService.GetRoomDetails(room_path_id)
            .success(function(res, status, headers, config) 
            {
               if (status === 200) {
                   roomViewService.roomViewModel.username = res['_creator'].username;
                   roomViewService.roomViewModel.title = res.title;
                   $scope.header = roomViewService.roomViewModel.username + "'s Cam - " + roomViewService.roomViewModel.title; 
                   $window.console.log("success response"); 
                   $window.console.log(res); 
             }

            })
            .error(function(res, status, headers, config) 
            {
                    $window.console.log("error response")
                    // Handle view error here
                    //$scope.error = 'Error: Invalid user or password';
                    $window.location.href = '/profile';
                    
            })
    
}



jamout.controllers.RoomViewController.INJECTS = ['$scope', '$http', '$window', '$location', 'roomViewService','authService','socket', jamout.controllers.RoomViewController];
