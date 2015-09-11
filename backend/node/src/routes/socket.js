
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
  /**
   * @type {*}
   */
   tallyUsers = {};



/*
* export fuction for listening to the socket
*/

exports.start= function (io) {
	io.sockets.on('connection', function (socket) {

  //console.log(socket);
  /**
  * @const
  */
  var currentRoom, id, name, totalUsers;

 /*
  * receive username from frontend 
  */
  socket.on('init', function (data, fn) {
 
   //console.log('This is data', data);

    currentRoom = (data || {}).room || uuid.v4();
    
    /** @const */
    var room = rooms[currentRoom];


      if(!data) 
          {
            rooms[currentRoom] = [socket];
            id = userIds[currentRoom] = 0;
            tallyUsers[currentRoom] = 0;
            fn(currentRoom, id);
            
            socket.emit('peer.totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                     
            
          } else {
            if (!room) {
              socket.emit('peer.limit', {error: "This stream has expired"});
              return;
            }

              if (tallyUsers[currentRoom] <= 8) {
                 if (data.currentId == 0) {
                    
                    room.forEach(function (s) {
                     s.emit('peer.totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
                     });

                    id = data.currentId;
                    fn(currentRoom, id);
                   
                   } else {
                     userIds[currentRoom] += 1;
                     tallyUsers[currentRoom] += 1;
                     totalUsers = tallyUsers[currentRoom];
                     id = userIds[currentRoom];  
                     socket.emit('peer.totalusers', { tallyUsers: tallyUsers[currentRoom]});               
                     fn(currentRoom, id);
                  }
                   room.forEach(function (s) 
                    {
                      s.emit('peer.connected', { id: id });
                      s.emit('peer.totalusers', { tallyUsers: tallyUsers[currentRoom]});
                    });
                      room[id] = socket;
                      console.log('Peer connected to room', currentRoom, 'with #', id);
                } else {
                    console.log('Room is at full capacity for', tallyUsers[currentRoom]);
                    socket.emit('peer.limit', {error: "The room you're trying to reach is at full capacity :( . Please try later <3"});
                    return;
                }
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
    console.log('Disconnecting Peer with id ', id);

    if(!currentRoom || !rooms[currentRoom]) {
      return;
    }
    

      tallyUsers[currentRoom] -= 1;
    
    

    //console.log ('disconnect tally users',  tallyUsers[currentRoom]);
    delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
    rooms[currentRoom].forEach(function (socket) {
      if (socket) {
        socket.emit('peer.disconnected', { id: id}); 
        socket.emit('peer.totalusers', { tallyUsers: tallyUsers[currentRoom]}); 
      }
    });
  });
 
 });

}
