
/**
* @constructor
*/
var uuid = require('node-uuid'),
    socketController     = require(PROJECT_ROOT + '/helper/socketController'),
   /**
   * @type {Object}
   */
   rooms = {},
   /**
   * @type {Object}
   */
   userIds = {},
  /**
   * @type {*}
   */
   tallyUsers = {},
   /**
   * todo implementation
   * @type {*}
   */
   participants = [];



/*
* export fuction for listening to the socket
*/

exports.start= function (io) {
	io.sockets.on('connection', function (socket) {

 // get new uesr on connection and setup the session id and user name
  // console.log('socket id', socket.id);
  // console.log('socket room', rooms);

  //   todo
  //   participants.push({id: data.id, name: newName });
  //     console.log('new socket connected with data', data);
  // });

  // Reconnect if heartbeat not received for 20 seconds
  socket.heartbeatTimeout = 20000;
 // for debugging
  // socket.conn.on('heartbeat', function() {
  //     var d = new Date();
  //     console.log("I'm a heart beat ");
  //     console.log(d.getSeconds(), " seconds");
  // });


  /**
  * Current Room Socket ID
  * @const
  */
  var currentRoom;
  /**
  * Current Peer Id
  * @const
  */
  var id;
  /**
  * Track username
  * @const
  */
  var currentUsername; 
  /**
  * Track total users for tallying
  * @const
  */
  var totalUsers;

  /**
  * Manage creator state on the server side
  * @type {Boolean}
  */
   var currentRoomCreator = false;

  
 /**
  * receive username from frontend 
  */
  socket.on('room:init', function (data, fn) {
 
   // console.log('This is data', data);

    currentRoom = (data || {}).room || uuid.v4();

    /** @const */
    var room = rooms[currentRoom];


      if(!data) 
          {
            // Create and setup room
            rooms[currentRoom] = [socket];
            id = userIds[currentRoom] = 0;
            tallyUsers[currentRoom] = 0;
            currentRoomCreator = true;
            fn(currentRoom, id);
            
            socket.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                     
            
          } else {
            //return if no data is received
            if (!room) {
              socket.emit('peer:limit', {error: "This stream has expired"});
              return;
            }
              // Check if room capacity hasn't been reached
              if (tallyUsers[currentRoom] <= 12) {
                
                    // check if room creator is joining (eg. refreshed page)
                     if (data.isCreator == true) {
                      // console.log('inside is creator join room');
                        currentRoomCreator = true;
                        room.forEach(function (s) {
                         s.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                         });

                        if (data.currentId !== null) { // current id is available when room is created
                          id = data.currentId;
                        } else { // if current id is not availalbe when room creator joins from another tab
                          // console.log("data.currentid is null");
                           userIds[currentRoom]++;
                           // console.log("USERID IN CURRENT ROOM IS", userIds[currentRoom]);
                           id = userIds[currentRoom]; 
                        }
                        fn(currentRoom, id);
                       
                       } else {
                         // If user is not a creator and data exist, then join the room
                         userIds[currentRoom]++;
                         tallyUsers[currentRoom]++;
                         totalUsers = tallyUsers[currentRoom];
                         id = userIds[currentRoom];  
                         socket.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]});                              
                         fn(currentRoom, id);
                      }

                       //update all rooms 
                       room.forEach(function (s) 
                        {
                          s.emit('peer:connected', { id: id });
                          s.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]});
                        });
                          room[id] = socket;
                          console.log('Peer connected to room', currentRoom, 'with #', id);
                
                } else {
                    // Return if room capacity has been reached
                    console.log('Room is at full capacity for', tallyUsers[currentRoom]);
                    socket.emit('peer:limit', {error: "The stream you're trying to reach is at full capacity :( . Please try later <3"});
                    return;
                }
          }

  });

  socket.on('peer:msg', function (data) {
    // console.log("peer message data", data);
    // console.log("peer message data to", data.to);
    var to = parseInt(data.to, 10);
    if (rooms[currentRoom] && rooms[currentRoom][to]) {
      // console.log('Redirecting message to', to, 'by', data.by);
      rooms[currentRoom][to].emit('peer:msg', data);
    } else {
      console.warn('Invalid room or user has left');
    }
  });

  socket.on('disconnect', function (data) {
   console.log('Socket Disconnecting');
    if(!currentRoom || !rooms[currentRoom]) {
      return;
    }
    
     if (id !== null || undefined) {
      console.log('Disconnecting Peer with id ', id);
      if (tallyUsers[currentRoom] > 0) {
        tallyUsers[currentRoom] -= 1;
      }
      
        if (currentRoomCreator && currentRoom) {
            //disconnecting socket live state in room model
            socketController.socket.disconnect(currentRoom);   
        }

        delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
        rooms[currentRoom].forEach(function (socket) {
          if (socket) {
            socket.emit('peer:disconnected', { id: id}); 
            socket.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
          }
        });
    }

  
  });


  // Chat Server
      socket.on('chatMessage:send', function (data) { 
        console.log("socket chat message sent by: ", data.username);
        console.log("socket chat message sent: ", data.message);

       var usr = data.username || "";
       var msg = data.message  || "";

       if (rooms[currentRoom]) {
        rooms[currentRoom].forEach(function (socket) {
          if (socket) {
            socket.emit('chatMessage:receive', { username: usr,
                                                  message: msg }); 
          }
        });
      } else {
        console.log('invalid user');
      }
    });



    socket.on('username:update', function(data) {

      if (data) {    
      var message = { username : data.username,
                      message : 'just joined!',
                      id: data.id };
          if (rooms[currentRoom]) {
                     rooms[currentRoom].forEach(function (s) 
                              {
                                 s.emit('user:joined', message);
                                
                              });
                   } 
       }
      });

});

}

