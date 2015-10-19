
/**
* @constructor
*/
var uuid = require('node-uuid'),
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
   * @type {*}
   */
   participants = [];
     /**
   * @type {*}
   */
   nameCounter= 1 ;



/*
* export fuction for listening to the socket
*/

exports.start= function (io) {
	io.sockets.on('connection', function (socket) {

 // get new uesr on connection and setup the session id and user name
  console.log('socket id', socket.id);

  // socket.on('SocketSession:init', function(data) {
  //   //TODO: RECEIVE USERNAME FROM FRONTEND ON SOCKETSESSION INIT
  //   var newName = "Guest " + nameCounter++;

  //   participants.push({id: data.id, name: newName });
  //     console.log('new socket connected with data', data);
  // });



  /**
  * @const
  */
  var currentRoom, id, currentUsername, totalUsers;

 /*
  * receive username from frontend 
  */
  socket.on('room:init', function (data, fn) {
 
   console.log('This is data', data);

    currentRoom = (data || {}).room || uuid.v4();

    /** @const */
    var room = rooms[currentRoom];


      if(!data) 
          {
            // Create and setup room
            rooms[currentRoom] = [socket];
            id = userIds[currentRoom] = 0;
            tallyUsers[currentRoom] = 0;
            fn(currentRoom, id);
            
            socket.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                     
            
          } else {
            //return if no data is received
            if (!room) {
              socket.emit('peer:limit', {error: "This room has expired"});
              return;
            }
              // Check if room capacity hasn't been reached
              if (tallyUsers[currentRoom] <= 8) {
                
                    // If room exists and the user id == 0 (creator) than simply emit back to peers
                    // Todo :if room owner leaves, their id is going to be different. Another way of checking creator status?
                    // Possible solution: emit creator status in the data object
                     if (data.currentId == 0) {
                        
                        room.forEach(function (s) {
                         s.emit('peer:totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                         });

                        id = data.currentId;
                        fn(currentRoom, id);
                       
                       } else {
                         // If user is not a creator and data exist, then join the room
                         userIds[currentRoom] += 1;
                         tallyUsers[currentRoom] += 1;
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
                          // if(data.username) {
                          //     s.emit('user joined', { username : data.username});
                          // }
                        });
                          room[id] = socket;
                          console.log('Peer connected to room', currentRoom, 'with #', id);
                
                } else {
                    // Return if room capacity has been reached
                    console.log('Room is at full capacity for', tallyUsers[currentRoom]);
                    socket.emit('peer:limit', {error: "The room you're trying to reach is at full capacity :( . Please try later <3"});
                    return;
                }
          }

  });

  
  socket.on('peer:msg', function (data) {
    var to = parseInt(data.to, 10);
    if (rooms[currentRoom] && rooms[currentRoom][to]) {
      console.log('Redirecting message to', to, 'by', data.by);
      rooms[currentRoom][to].emit('peer:msg', data);
    } else {
      console.warn('Invalid user');
    }
  });

  socket.on('disconnect', function (data) {
   console.log('Socket Disconnecting', data);
    if(!currentRoom || !rooms[currentRoom]) {
      return;
    }
    
     if (id !== undefined) {
      console.log('Disconnecting Peer with id ', id);
      tallyUsers[currentRoom] -= 1;

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
        console.log("chatMessage socket message received");
       if (rooms[currentRoom]) {
        rooms[currentRoom].forEach(function (socket) {
          if (socket) {
            socket.emit('chatMessage:receive', { username: data.username,
                                                  message: data.message }); 
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

