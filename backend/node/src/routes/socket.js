
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
   userIds = {};



/*
* export fuction for listening to the socket
*/

exports.start= function (io) {
	io.sockets.on('connection', function (socket) {

  //console.log(socket);
  /**
  * @const
  */
  var currentRoom, id, name;

 /*
  * receive username from frontend 
  */
  socket.on('init', function (data, fn) {
 
    console.log('This is data', data);
    // use name later for chat
    // if (data.name) {
    //   name = data.name;
    // };
    // console.log('User just logged in ' + name)
    currentRoom = (data || {}).room || uuid.v4();
    
    /** @const */
    var room = rooms[currentRoom];

    if (room) 
    {
      if (room.length > 2) 
      {
        socket.emit('peer.limit', {error: "The room you're trying to reach is at full capacity :( . Please try again later <3"});
        return;
      } 
    }

      if(!data) 
          {
            rooms[currentRoom] = [socket];
            id = userIds[currentRoom] = 0;
            fn(currentRoom, id);
            console.log('Room created, with #', currentRoom);
          } else {
            if (!room) {
              socket.emit('peer.limit', {error: "This stream has expired"});
              return;
            }

             userIds[currentRoom] += 1;
             id = userIds[currentRoom];

             fn(currentRoom, id);
             console.log(userIds[currentRoom]);
            // console.log(id);
            // console.log(room);
                
               room.forEach(function (s) 
                {
                  s.emit('peer.connected', { id: id });
                });
                  room[id] = socket;
                  console.log('Peer connected to room', currentRoom, 'with #', id);
          }

  });

  
  socket.on('msg', function (data) {
    var to = parseInt(data.to, 10);
    if (rooms[currentRoom] && rooms[currentRoom][to]) {
      console.log('Redirecting message to', to, 'by', data.by);
      rooms[currentRoom][to].emit('msg', data);
    } else {
      console.warn('Invalid user');
    }
  });

  socket.on('disconnect', function () {
    console.log('Disconnecting Peer');
    console.log('id', id);
    if(!currentRoom || !rooms[currentRoom]) {
      return;
    }
    delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
    rooms[currentRoom].forEach(function (socket) {
      if (socket) {
        socket.emit('peer.disconnected', { id: id}); //id 1
      }
    });
  });
 });

}
