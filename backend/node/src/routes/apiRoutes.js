/**
 * This file provides api handlers 
 */

 var userdb     = require(PROJECT_ROOT + '/models/userModel'),
     roomdb     = require(PROJECT_ROOT + '/models/roomModel'),
     guestlistdb     = require(PROJECT_ROOT + '/models/guestlistModel'),
     contactlistdb    = require(PROJECT_ROOT + '/models/contactlistModel'),
     contactrequestdb = require(PROJECT_ROOT + '/models/contactrequestModel'),
     mongoose   = require('mongoose'),
     jwtoken    = require('jsonwebtoken'), //JSON web token sign and verification 
     jwt        = require('express-jwt'),
     nodemailer = require('nodemailer'),
     sgTransport = require('nodemailer-sendgrid-transport'),
     crypto     = require('crypto'),
     async      = require('async'), // authentication middleware
     secret     = require(PROJECT_ROOT + '/config/secret'),
     sendgrid   = require(PROJECT_ROOT + '/config/sendgrid'),
     message    = require(PROJECT_ROOT + '/models/messageModel'),
     role       = require(PROJECT_ROOT + '/models/roleModel'),
     socket     = require(PROJECT_ROOT + '/routes/socket.js');

var contactsController = require(PROJECT_ROOT + '/helper/contactsController'),
    activityController = require(PROJECT_ROOT + '/helper/activityController');




/**
 * Login
 */

var apiLogin= function(req, res) {
    //send page
    // console.log("receive login request \n");


    if(!!!res.isValidParams) {
        return;
    }
    // console.log("after valid params \n", req.body);

    var email    = req.body.email || '';
    var password = req.body.password || '';
    
    
    userdb.userModel.findOne({email: email}, { room: 0})
    .exec(function (err, user) {

        if (err) {
            console.log(err);
            return res.status(500).send({error : "Hmmm, cannot receive a response. Please try again."});
        }

        if (user === null) {
            return res.status(401).send({error : "Invalid email or password"});
        }

        user.verifyPassword(password, function(isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.email);
                return res.status(401).send({error : "Invalid email or password"});
            }
            req.session.role = user.privileges;
            // TODO req.session.user should not store the rooms 
            // console.log(user);
            req.session.user = user;
            var token = jwtoken.sign({id: user._id}, secret.secretToken, { maxAge: '12h' });
            //console.log(token);
            res.status(200).json({token: token});
        });
    });

    //res.send("login success");
};
apiLogin.PATH = '/api/login';
apiLogin.METHOD = 'POST';
apiLogin.MSG_TYPE = message.LoginRequestMessage;
apiLogin.TOKEN_VALIDATE = false;
apiLogin.ROLE_REQUIRED  = ['admin','user', 'guest'];

/**
 * Logout
 */
var apiLogout= function (req, res) {
    //console.log(req.headers);

        // console.log('inside req session destroy');
    

    if (req.user || req.session.user) {
        //session remove
        delete req.session.role;
        delete req.session.user;
        //token remove
        delete req.user;
   
        return res.status(200).end();
    }
    else {
        return res.status(401).end();
    }
 };
apiLogout.PATH = '/api/logout';
apiLogout.METHOD = 'GET';
apiLogout.TOKEN_VALIDATE = true;
apiLogout.ROLE_REQUIRED = ['admin', 'user'];

/**
 * Signup
 *
 */
var apiSignup= function(req, res) {
     //console.log('inside signup request');

    if(!!!res.isValidParams) {
         return;
     }



    //send page
    console.log("receive sigun up request \n");
    //console.log(req.body);

    var email = req.body.email || '';
    var username = req.body.username || '';
    var about = req.body.about || '';
    var location = req.body.location || '';
    var url = req.body.url || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

    /**
     * @expose
     * @type {userdb.UserSchema}
     */
    var user = new userdb.userModel();
    user.email = email;
    user.username = username;
    user.about = about;
    user.location = location;
    user.url = url;
    user.password = password;
    // console.log(user);

    /*____________________________Checking existing user directly in userModel.js before user.save is called_____________________________________________*/
   

    user.save(function (err, user) {
        if (err) {
           // console.log('err', err);
            if (err.code == 11000) {            
            return res.status(500).send({error : 'The email or username already exists'});
            }
            //console.log('error is', err);
            return res.status(500).send({error : 'Oops, something is wrong. Please try again.'});
        }
            
             req.session.role = user.privileges;
             req.session.user = user;
            // console.log('User created');
             var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 * 12 });
             return res.status(200).json({token: token});
              
    });
};      
apiSignup.PATH = '/api/signup';
apiSignup.METHOD = 'POST';
apiSignup.MSG_TYPE = message.SignupRequestMessage;
apiSignup.TOKEN_VALIDATE = false;
apiSignup.ROLE_REQUIRED = ['admin', 'guest'];

/**
* Forgot Password
*/

var apiForgotPassword = function(req, res, next) {

    if(!!!res.isValidParams) {
         return;
     }
     // console.log('after res valid params');

   async.waterfall([
    function (done) {
        crypto.randomBytes(20, function(err, buf){
            var token = buf.toString('hex');
            done(err, token);
        });
      },
      function(token, done) {
        userdb.userModel.findOne({ email: req.body.email }, function(err, user){
            if (!user){
                res.status(404).json({error: 'No account with that email address exists.'});
                // redirect to forgot from frontend
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
                done(err, token, user);
            });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport(sgTransport(apiForgotPassword.OPTIONS));
        var email = {
            from: 'Jamout <passwordreset@jamout.tv>',
            to: user.email,
            subject: 'Jamout Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'https://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore the email and your password will remain unchanged.\n\n' +
            'Love,\n\n' +
            'Jamout'
        };
        smtpTransport.sendMail(email, function(err){
            var message = 'An e-mail has been sent to ' + user.email + ' with further instructions. Please check your inbox or Junk Mail.' ;   
            
               res.send({success: message });
            
            done(err, 'done');
        });
      }
    ], function(err) {
        //if (err) return next(err);
        if (err) {
            console.log(err);
            return res.status(500).send({error: 'Something broke!'});
        }
    });
};

apiForgotPassword.PATH = '/api/forgot';
apiForgotPassword.METHOD = 'POST';
apiForgotPassword.MSG_TYPE = message.ForgotPasswordRequestMessage; 
apiForgotPassword.TOKEN_VALIDATE = false;
apiForgotPassword.OPTIONS = sendgrid.options;
apiForgotPassword.ROLE_REQUIRED = ['admin', 'user', 'guest'];

var apiGetPasswordToken = function (req, res, next) {
   userdb.userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.status(404).send({error: 'Password reset token is invalid or has expired'});
    }
    res.render('resetPassword', {
      user: req.user
    });
  });
};

apiGetPasswordToken.PATH = '/reset/:token';
apiGetPasswordToken.METHOD = 'GET';
apiGetPasswordToken.TOKEN_VALIDATE = false;
apiGetPasswordToken.ROLE_REQUIRED = ['admin','user','guest'];


/**
* After user has landed on reset page, post request to update password
* POST Password Token
*/

var apiPostPasswordToken = function(req, res, next) {

    if(!!!res.isValidParams) {
         return;
     }

     // console.log('after valid params');

 async.waterfall([
    function(done){
     userdb.userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
        if(!user) {

           return res.status(404).send({error: 'Password reset token is invalid or has expired'});
        }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err){
            if (err) {
                console.log('error', err);

                return res.status(400).send({error: 'Oops! Something went wrong'});
            }
                  done(err, user);
          });
     });
   },
   function(user, done) {
       var smtpTransport = nodemailer.createTransport(sgTransport(apiPostPasswordToken.OPTIONS));
       var email = {
        from: 'Jamout <passwordreset@jamout.tv>',
        to: user.email,
        subject: 'Your password has been changed',
        text: 'Hello, \n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has been changed. Please login with your new password. \n\n' +
        'https://' + req.headers.host + '/login' +' \n\n' +
        'Love,\n\n' +
        'Jamout'
    };
        smtpTransport.sendMail(email, function(err, info){
           //console.log('Message sent: ', info);
           if (info["message"] == 'success') {
                res.status(200).send({success: 'Success! Your password has been changed.' });
           }
        done(err);
    });
   }
 ], function(err) {
        //if (err) return next(err);        
        if (err) {
        return res.status(500).send({error: 'Something broke!'});
       }
    });
};

apiPostPasswordToken.PATH = '/api/reset/:token';
apiPostPasswordToken.METHOD = 'POST';
apiPostPasswordToken.MSG_TYPE = message.PostPasswordTokenRequestMessage; 
apiPostPasswordToken.TOKEN_VALIDATE= false;
apiPostPasswordToken.OPTIONS= sendgrid.options;
apiPostPasswordToken.ROLE_REQUIRED = ['admin', 'user', 'guest'];


var apiInviteFriend = function (req, res) {
    var sender, receiver_name, receiver_email, success_message;


    //TODO
    if(!!!res.isValidParams) {
         return;
     }
    

    async.waterfall([
    function(done){
     userdb.userModel.findOne({ _id: req.session.user._id}, {password:0, room: 0}).exec(function(err, user){
        if(!user) {
           console.log('cannot find the user');
           return res.status(404).send({error: 'Please login again to send an invite'});
        }

           sender = user.username;
           receiver_name = req.body.name;
           receiver_email = req.body.email;

            // todo: make sure the sentTo are not duplicates
           //increment a users sent invites
           user.invites.totalSent++;
           user.invites.sentTo.push({ name: receiver_name, email: receiver_email});
           
          user.save(function(err){
            if (err) {
                console.log('error', err);

                return res.status(400).send({error: 'Oops! Something went wrong'});
            }
                  done(err, user);
          });
     });
   },
   function(user, done) {
       var smtpTransport = nodemailer.createTransport(sgTransport(apiInviteFriend.OPTIONS));
       var email = {
        from: 'Jamout <invitation@jamout.tv>',
        to: receiver_email,
        subject: 'Please confirm. ' + sender + ' has sent you an invitation to live cam stream on JamOut.',
        text: 'Hello ' + receiver_name + ', \n\n' +
        'You are receiving this email because ' + sender + ' has invited you. Please follow the link below and use the secret to access JamOut.\n\n' +
        'The secret is: pizza \n\n' +
        'https://www.jamout.tv \n\n' +
        'Please ignore this email if you\'re not ' + receiver_name + '.\n\n' +
        'Love,\n\n' +
        'JamOut'
    };
        smtpTransport.sendMail(email, function(err, info){
           // console.log('Message sent: ', info);
            success_message = 'Your invitation has been successfully sent to ' + receiver_name;
           if (info["message"] == 'success') {            
                res.status(200).send({success: success_message });
           }
        done(err);
    });
   }
 ], function(err) {
        //if (err) return next(err);        
        if (err) {
        return res.status(500).send({error: 'Sorry, the provided email is not valid or something went wrong! Please try again'});
       }
    });

};

apiInviteFriend.PATH = '/api/invite/friend';
apiInviteFriend.METHOD = 'POST';
apiInviteFriend.MSG_TYPE = message.InviteFriendRequestMessage;
apiInviteFriend.TOKEN_VALIDATE = true;
apiInviteFriend.ROLE_REQUIRED = ['admin','user'];
apiInviteFriend.OPTIONS = sendgrid.options;

/**
 * Get user profile detail
 *
 */
var apiProfileDetail= function(req, res) {

    // console.log("receive request for apiProfileDetail \n");

     userdb.userModel.findOne({ _id: req.session.user._id}, 
      // 0 excludes the fields
      { password: 0, room: {$slice: -5}})
      .populate({path: 'room',
                 select: 'title'})
     .exec(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        // do this in message middleware
        if (user === undefined) {
            return res.status(401).end();
        }

       // console.log(user);
        return res.status(200).send(user);
    });
};

apiProfileDetail.PATH = '/api/profile';
apiProfileDetail.METHOD = 'GET';
apiProfileDetail.TOKEN_VALIDATE = true;
apiProfileDetail.ROLE_REQUIRED = ['admin', 'user'];

/**
* Get Total # of Profiles
*/
var apiGetTotalProfiles = function (req, res) {
     // console.log("received request for get total profiles\n");
 
    userdb.userModel.count()
     .exec(function (err, users){
       // console.log(users);
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (users === undefined) {
            return res.status(401).end();
        }

        return res.status(200).json(users);
     });
};

apiGetTotalProfiles.PATH = '/api/profile/total';
apiGetTotalProfiles.METHOD = 'GET';
apiGetTotalProfiles.TOKEN_VALIDATE = true;
apiGetTotalProfiles.ROLE_REQUIRED = ['admin'];



/**
* Get recent profiles
*/

/**
* Return 5 recent profiles 
*/
var apiGetRecentProfiles = function (req, res) {
     // console.log("received request for get total profiles\n");
 
    userdb.userModel.aggregate([
        {$group:{ _id: {id: '$_id', username : '$username' }}}, {$sort: { _id : -1}}, {$limit: 5}
        ])
     .exec(function (err, users){

        if (err) {
            console.log(err);
            return res.status(401).json({error : 'There seems to be a problem. Please check back later!'});
        }

        if (users === undefined) {
            return res.status(401).json({error : 'There seems to be a problem. Please check back later!'});
        }
        return res.status(200).json({success : users});
     });
};

apiGetRecentProfiles.PATH = '/api/profile/recent';
apiGetRecentProfiles.METHOD = 'GET';
apiGetRecentProfiles.TOKEN_VALIDATE = false;
apiGetRecentProfiles.ROLE_REQUIRED = ['admin', 'user'];

/**
 * Edit Profile
 *
 */
var apiProfileEdit= function(req, res) {

    if(!!!res.isValidParams) {
         return;
     }

    //checking and only adding the fields that have been sent
    var data = {};
    Object.keys(req.body).forEach(function(k) 
    {
        if (req.body[k]) 
        {
        data[k] = req.body[k];            }
    });
    
        delete data._id;

     //console.log(data);
    
     userdb.userModel.findByIdAndUpdate({ _id: req.session.user._id}, {$set: data}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (!user) {
            return res.status(401).end();
        }
        //console.log(user);
        return res.status(200).send(user);
    });
};

apiProfileEdit.PATH = '/api/profile/edit';
apiProfileEdit.METHOD = 'PUT';
apiProfileEdit.MSG_TYPE = message.ProfileEditRequestMessage;
apiProfileEdit.TOKEN_VALIDATE = true;
apiProfileEdit.ROLE_REQUIRED = ['admin', 'user'];

/**
 * Get user url profile
 *
 */
//TODO: limit the rooms returned by {$lte: 10}
var apiGetViewerProfile= function(req, res) {
    //send page

     userdb.userModel.findOne({ _id: req.params.id}, 
      // 0 excludes the fields
      { password: 0, room: {$slice: -5}})
      .populate({path: 'room',
                 select: 'title'})
       .exec(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        // do this in message middleware
        if (user === undefined) {
            return res.status(401).end();
        }

       // console.log(user);
        return res.status(200).send(user);
    });
};
apiGetViewerProfile.PATH = '/api/profile/:id';
apiGetViewerProfile.METHOD = 'GET';
apiGetViewerProfile.TOKEN_VALIDATE = false;
apiGetViewerProfile.ROLE_REQUIRED = ['admin', 'user', 'guest'];



// //TODO ROUTES
// app.get('/api/users', checkUser, db, routes.users.getUsers);
// app.post('/api/users', checkAdmin, db, routes.users.add);
// app.put('/api/users/:id', checkAdmin, db, routes.users.update);
// app.del('/api/users/:id', checkAdmin, db, routes.users.del);

//todo implementation purposely delayed until admin implementation
// var apiProfileDelete= function(req, res) {
//     //send page
//     //console.log(req.headers);
//     console.log("receive request \n");
    

//    /* if ( email == '' || password == '' || password != passwordConfirmation) {
//             return res.status(400).end();
//     }*/
  
//      db.userModel.findByIdAndRemove({ _id: req.user.id}, {}, function(err, obj) {
//         if (err) next(err);

//           if (req.user)
//          {
//               delete req.user;
//               return res.status(200).send(obj);
//          }
//           else 
//          {
//               return res.status(401).end();
//          }
//   });
// };
// apiProfileDelete.PATH = '/api/profile/:id';
// apiProfileDelete.METHOD = 'DEL';
// apiProfileDelete.TOKEN_VALIDATE = true;

//TODO room apiroutes implementation
//exports.apiRoom = function(req, res) {
  // res.send('Room Success');
//}

/**
 * Create Room
 *
 */
var apiRoomCreate = function(req, res) {
    // console.log("receive request \n");
     //console.log(req);

    if(!!!res.isValidParams) {
        return;
    }

     if (!req.session.user) {
        return res.send(400);
     }

     var title = req.body.title;
     var userId = req.session.user._id;

     
     if (title === null) {
        return res.status(401).end();
     }
     
     var room = new roomdb.roomModel();
     room.title = title;
     room._creator = userId;

      

        room.save(function (err, room) {
        if (err) {
            console.log(err);
            return res.status(400).end();
        }
       // console.log('inside room save', room);
       /*******************how do I limit the room Array data I'm receiving***********************/ 
        roomdb.roomModel
        .findOne({_id: room.id})
        .populate({ 
            path : '_creator',
            select : 'room _id username url' 
            })
        //.where('room').slice(-5)   Does not work to limit room array value..
        .exec(function (err, room){
           // console.log("Room " +  room);
            if (err) return res.status(400).end();

                //store the room.username in room Array
                console.log('The creator is %s', room._creator.username);
                room._creator.room.push(room.id);
                room._creator.save();
        
                      console.log("Room Create Success");
                      return res.status(200).send(room.id);
            
        });        
    });
     
};


apiRoomCreate.PATH = '/api/room/create';
apiRoomCreate.METHOD = 'POST';
apiRoomCreate.MSG_TYPE = message.RoomCreateRequestMessage;
apiRoomCreate.TOKEN_VALIDATE = true;  
apiRoomCreate.ROLE_REQUIRED = ['admin', 'user'];



/**
 * Get room url detail
 *
 */
var apiGetRoom= function(req, res) {
  
    //send page
    // console.log("receive request \n");
    // console.log("req param id" + req.param("id"));

     roomdb.roomModel
     .findOne({ _id: req.params.id})
     .populate({ 
            path : '_creator',
            select : '_id username url'
            })
     .exec(function (err, room) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        
         if (room === undefined) {
            return res.status(401).end();
        }

        return res.status(200).send(room);
    });
};
apiGetRoom.PATH = '/api/room/:id';
apiGetRoom.METHOD = 'GET';
apiGetRoom.TOKEN_VALIDATE = false;
apiGetRoom.ROLE_REQUIRED = ['admin', 'user', 'guest'];

/**
* Get total # of rooms
*/
var apiGetTotalRooms = function(req, res) {
    // console.log("received request for get total rooms\n");
 
    roomdb.roomModel.count()
     .exec(function (err, rooms){
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (rooms === undefined) {
            return res.status(401).end();
        }

        return res.status(200).json(rooms);
     });
};

apiGetTotalRooms.PATH = '/api/room/total';
apiGetTotalRooms.METHOD = 'GET';
apiGetTotalRooms.TOKEN_VALIDATE = true;
apiGetTotalRooms.ROLE_REQUIRED = ['admin'];


// create route to update socket id in the room model of theuser created
var apiRoomUpdateSocket = function (req, res) {    
    console.log("received message for socket update", req.body);

    if(!!!res.isValidParams) {
        return;
    }

    var id = req.body.id;
    var room_id = req.body.room_id;
    var room_live = req.body.live;

    roomdb.roomModel
        .findOne({_id: room_id})
        .exec(function (err, room){
            if (err) {
                console.log(err);
                return res.status(401).end();
            }            
             if (room === undefined) {
                return res.status(401).end();
            }
            room.socket = id;
            room.live = room_live;
            room.save();
            // console.log("Room Socket Update Success", room.socket);
            return res.status(200).send(room.socket);
            
        });   

};

apiRoomUpdateSocket.PATH = '/api/socket/room';
apiRoomUpdateSocket.METHOD = 'POST';
apiRoomUpdateSocket.MSG_TYPE = message.RoomUpdateSocketRequestMessage;
apiRoomUpdateSocket.TOKEN_VALIDATE = false;
apiRoomUpdateSocket.ROLE_REQUIRED = ['admin', 'user'];

//request socket to join 
var apiRoomGetSocket = function (req, res) {    
    // console.log("received message for socket GET");
    // console.log(req.params);
    // todo req.params validation
    // if(!!!res.isValidParams) {
    //     return;
    // }

    var room_id = req.params.id;

    roomdb.roomModel
        .findOne({_id: room_id})
        .exec(function (err, room){
            if (err) {
                console.log(err);
                return res.status(401).end();
            }            
             if (room === undefined) {
                return res.status(401).end();
            }
            // console.log('room socket is', room);
            // console.log('room socket is', room.socket);
            return res.status(200).send(room.socket);
            
        });   

};

apiRoomGetSocket.PATH = '/api/socket/room/:id';
apiRoomGetSocket.METHOD = 'GET';
//apiRoomGetSocket.MSG_TYPE = message.RoomGetSocketRequestMessage; // todo req.params validation
apiRoomGetSocket.TOKEN_VALIDATE = false;
apiRoomGetSocket.ROLE_REQUIRED = ['admin', 'user', 'guest'];

// update guest list for access
var apiUpdateGuestList = function (req, res) {    
    // console.log("received message for api update Guest List");

    if(!!!res.isValidParams) {
        return;
    }

    var successResponse = {success: "Awesome! Your email has been added to our guestlist.  We'll send out invites as they become available. If you know any rad music or art creators, invite them too!"};
    var errorResponse = {error: "Oops, something is wrong. Please try again."};
    var guestlist = guestlistdb.guestlistModel();
    guestlist.email = req.body.email;
    guestlist.url = req.body.url;

    guestlist.save(function (err, user) {
            if (err) {
                // duplicate key
                if (err.code == 11000) {            
                return res.status(500).json({error : 'This email already exists.'});
                }
                console.log('error is', err);
                return res.status(500).json(errorResponse);
            }
                     
                // console.log('Email created');                
                 return res.status(200).json(successResponse);
                  
        });

};

apiUpdateGuestList.PATH = '/api/requestinvite';
apiUpdateGuestList.METHOD = 'POST';
apiUpdateGuestList.MSG_TYPE = message.UpdateGuestListRequestMessage;
apiUpdateGuestList.TOKEN_VALIDATE = false;
apiUpdateGuestList.ROLE_REQUIRED = ['admin', 'user', 'guest'];

var apiGetGuestListTotal = function (req, res) {
   guestlistdb.guestlistModel.count()
     .exec(function (err, total){
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (total === undefined) {
            return res.status(401).end();
        }

        return res.status(200).json(total);
     });
};

apiGetGuestListTotal.PATH = '/api/guestlist/total';
apiGetGuestListTotal.METHOD = 'GET';
apiGetGuestListTotal.TOKEN_VALIDATE = true;
apiGetGuestListTotal.ROLE_REQUIRED = ['admin'];



/**
* Creates contact document
* Updates contact in owners document
* 
*/
var apiCreateContact = function (req, res) {
    // console.log('Received request for apiCreateContact');
    // console.log('current id is', req.body.currentUserId);
    // console.log('contact id is', req.body.contactAddId);

    if(!!!res.isValidParams) {
        return;
    }
    var currentUserId = req.body.currentUserId;
    var contactAddId = req.body.contactAddId;
    // TODO: Check if contact hasn't been already created 

    async.waterfall([ function (done) {
        var contact = contactlistdb.contactModel();
        contact.ownerId = currentUserId;
        contact.contactAddId = contactAddId;

        contact.save(function(err, contact){
            if (err) {
                console.log(err);
                if (err.code == 11000) { //duplicate key
                    return res.status(200).json({error : 'User is in contacts'});
                }
                return res.status(401).json({error : 'Error Response'});
            }
            // console.log('contact saved');
            done(err, contact);
          });
      }, function (contact, done) {   //update in owners contacts
        userdb.userModel
        .findOne({_id: contact.ownerId}, {password:0, room: 0})
        .exec(function(err, user) {
            if (err) {
              if (err.code == 11000) { //duplicate key
                   return res.status(200).json({error : 'User is already in contacts'});
                }      
                   console.log(err);
                   return res.status(404).json({error : 'error updating contact'});
            }
            if (user) {
                user.contacts || (user.contacts = []);
                user.contacts.push(contact.id);
                user.save();
            }
            // console.log('contact saved in contacts');
            done(err);
        });
      }, function (done) { //create contact request

        var contactrequest = contactrequestdb.contactRequestModel();
        contactrequest.senderId = currentUserId;
        contactrequest.receiverId = contactAddId;

        contactrequest.save(function(err, contactrequest){
            if (err) {
                console.log(err);
                return res.status(404).json({error: 'Problem saving contact request'});
            }
            // console.log('contact request is successfully saved');
            if(contactrequest) {
               res.status(200).json({success: 'Contact request successfully sent'});
            }
            done(err);
      });
     }
    ], function (err){
        if (err) {
            console.log(err);
            return res.status(500).json({error: "Contact creation failed"});
        }
    });
};

apiCreateContact.PATH = '/api/contact/create';
apiCreateContact.METHOD = 'POST';
apiCreateContact.MSG_TYPE = message.CreateContactRequestMessage;
apiCreateContact.TOKEN_VALIDATE = true;
apiCreateContact.ROLE_REQUIRED = ['admin', 'user'];


/**
* Search for a contact by username
* so users can add them
*/
var apiSearchContact = function (req, res) {
    // console.log('contact search request received');
    // console.log('req body is', req.body);
    
    // if (!!!isValidParams) {
    //     return;
    // }

    var userId;
    var currentUserId = req.session.user._id;
    var username = req.body.username;
    userdb.userModel.aggregate([
        { $match: 
          { username: username}
        },
        {
           $group : {
            _id: {id: '$_id', username: '$username'}
          }
        }
    ]).exec(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).json({error: 'Dang! This username cannot be found'});
        }
       // console.log('user is', user);  
       if (user.length !== 0) {   
          userId = user[0]._id.id;

           if (userId == currentUserId) {
              return res.status(200).json({success:"Sorry! You can't add yourself :c"});
           }
  
         return res.status(200).json({user: user});
      }
      return res.status(200).json({success: "Dang! Can't find that username :/"});
    });
};

apiSearchContact.PATH = '/api/contact/search';
apiSearchContact.METHOD = 'POST';
apiSearchContact.MSG_TYPE = message.SearchContactRequestMessage;
apiSearchContact.TOKEN_VALIDATE = true;
apiSearchContact.ROLE_REQUIRED = ['admin', 'user'];


/**
* Returns an array of contacts
*/
var apiGetContacts = function (req, res) {
    // console.log('get contact request');

    var ownerId = req.session.user._id || null;

    contactlistdb.contactModel.find({ownerId: ownerId})
    .sort({_id: -1}) 
    .populate({
        path: 'contactAddId',
        select:'_id username'
    })
    .exec(function(err, contacts) {
        if (err) {
            console.log(err);
            return res.status(401).json({error:'Please try again in a bit'});
        }
        // console.log('contacts', contacts);
       res.status(200).json({success: contacts});
    });
};

apiGetContacts.PATH = '/api/contacts/get';
apiGetContacts.METHOD = 'GET';
apiGetContacts.TOKEN_VALIDATE = true;
apiGetContacts.ROLE_REQUIRED = ['admin', 'user'];

/**
* Delete Contact
* TODO: Remove from current users contact
* TODO: Delete from contacts contact
* TODO: Delete contact request
*/
// apiDeleteContact= function (req, res) {
//     console.log('delete contact request');
//     res.status(200).json({success: 'success Response'});
// }

// apiDeleteContact.PATH = '/api/contact/delete';
// apiDeleteContact.METHOD = 'POST';
// apiDeleteContact.TOKEN_VALIDATE = true;
// apiDeleteContact.ROLE_REQUIRED = ['admin', 'user'];

/*
* Retrieve contacts that are pending so the user can accept them
*/
var apiGetPendingContacts = function(req, res) {
     // console.log("request for pending contacts successfuly received");
     // console.log('current user', req.session.user._id);

     var currentUserId = req.session.user._id || null;
     // console.log('currentUserId is', currentUserId)
     contactrequestdb.contactRequestModel
     .find({receiverId: currentUserId, accepted: false}, {receiverId: 0, accepted: 0}) 
     .populate({
        path: 'senderId',
        select: '_id username'
     })
     .exec(function(err, contactRequests){
        if (err) {
            console.log(err);
            return res.status(401).send({error: 'There is a problem retrieving contact requests.'});
        }
        // console.log("contacts requests are", contactRequests);
     return res.status(200).json({success: contactRequests});
     });
};


apiGetPendingContacts.PATH = '/api/contact/pending/get';
apiGetPendingContacts.METHOD = 'GET';
apiGetPendingContacts.TOKEN_VALIDATE = true;
apiGetPendingContacts.ROLE_REQUIRED = ['admin', 'user'];

/**
* Accept a contact request
* @pram {Object} req
* @param {Object} res
*/
var apiAcceptPendingContacts = function(req, res) {
    
    // console.log('Request for accepting contacts received pre params' );
    
    if (!!!res.isValidParams) {
        console.log('return is validParams');
        return;
    }

    var currentUserId = req.session.user._id || null;
    var contactRequestSenderId;
    var contactModelId = req.body.id;
    
    // csonsole.log('currentUserId is', currentUserId);
    async.waterfall([ function (done) { //accept contact in contact requests

    
     contactrequestdb.contactRequestModel
    .findById(contactModelId)
    .exec(function(err, contactRequest){
        if (err) {
            console.log(err);
            return res.status(500).json({error: 'There seems to be a problem updating contact request. Please try again later'});
        }
        
       // console.log('contact request data is', contactRequest);

        if (!!!(contactRequest.receiverId == currentUserId)) {
            return res.status(500).json({error: 'There is an error updating your contact. Please logout and login again to fix this.'});
        }

        if (!!!(contactRequest.accepted === true)) {
           contactRequest.accepted = true;

            contactRequest.save(function(err, contactRequest){
                if (err) {
                    console.log(err);
                    return res.status(500).json({error: 'There seems to be a problem saving the contact request. Please try again later'});
                }
            
               done(err, contactRequest);            
               });
            
         } else {
            return res.status(200).json({success: 'Contact Request has already been accepted!'}); 
         }

       });
      }, function (contactRequest, done) {   //create contact for current user
        // console.log('contact request in the followup', contactRequest);

        contactRequestSenderId = contactRequest.senderId;

        var contact = contactlistdb.contactModel();
        contact.ownerId = contactRequest.receiverId;
        contact.contactAddId = contactRequestSenderId;
        contact.accepted = true;

        contact.save(function(err, contact){  //create and save contact for current user
            if (err) {
                console.log(err);
                if (err.code == 11000) { //duplicate key
                    return res.status(401).json({error : 'User is already in contacts'});
                }
                return res.status(401).json({error : 'Error Response'});
            }
            console.log('contact saved');
            // console.log('contact is', contact);
            done(err, contact);
          });

      }, function (contact, done) { //save in user contacts
         userdb.userModel
        .findOne({_id: contact.ownerId}, {password:0, room: 0})
        .exec(function(err, user) {
            if (err) {
              if (err.code == 11000) { //duplicate key
                   return res.status(401).json({error : 'User is already in contacts'});
                }      
                   console.log(err);
                   return res.status(404).json({error : 'error updating contact'});
            }
          // console.log('inside contact in user');
           if (user) {  
            
             user.contacts || (user.contacts = []);
             user.contacts.push(contact.id);
             user.save(function(err, user){
             
                if (err) {
                    return res.status(500).json({error:'There seems to be a problem saving in the contact list. Please try again later!'});
                }
                if (user){
                    console.log('contact in user saved');
                }
                done(err, contact);
            });
          }
        });
     }, function (contact, done) { //updated accepted status in contact who sent the request
        // console.log('updating contact initiater id');
         contactlistdb.contactModel
        .findOne({ownerId: contactRequestSenderId, contactAddId: currentUserId})
        .exec(function(err, contact) {
            if (err) {
                   console.log(err);
                   return res.status(404).json({error : 'error updating contact'});
            }
            // console.log('initiaters contact found', contact);
            if (contact) {
            contact.accepted =  true;
               contact.save(function(err, contact){
                    if (err) {
                        return res.status(500).json({error:'There seems to be a problem saving in the contact list. Please try again later!'});
                    }
                    
                    return res.status(200).json({success: 'Contact has been successfully added'});
                    done(err);
              });
          }
        });
       
           
     } 
    ], function (err){
        if (err) {
            console.log(err);
            return res.status(500).json({error: "Contact creation failed"});
        }
    });
};
//todo: make the api end point consistent
apiAcceptPendingContacts.PATH = '/api/contact/accept';
apiAcceptPendingContacts.METHOD = 'POST';
apiAcceptPendingContacts.MSG_TYPE =  message.AcceptPendingContactsMessage;
apiAcceptPendingContacts.TOKEN_VALIDATE = true;
apiAcceptPendingContacts.ROLE_REQUIRED = ['admin', 'user'];

/**
* Takes a user id and verifies it
* Returns inContacts if a user is in contacts
* Returns pendingContact if a contact request has been received
* Returns noRelatiopnship if no contact request has taken place between two users
* @param req
* @param res
* @constructor
*/
var apiVerifyContact = function (req, res) {
    // console.log(req.body);
    // check for body id
    if(!!!req.body.id) {
        console.log('no body');
        return;
    }


    var contacts, contactStatus;  
    var currentUserId = req.session.user._id;
    var checkUserId = req.body.id;

    // console.log('check user id',checkUserId);
  
    
    if (currentUserId == checkUserId) {
        return res.status(200).json({success: "You can't add your selfff :C"});
    }
 
        contactlistdb.contactModel
        .findOne({ownerId: currentUserId, contactAddId: checkUserId })
        .exec(function (err, contact){
            if (err) {
                console.log(err);
                return res.status(401).json({error: "There seems to be a problem. Please try again later"});
            }
            // console.log("res is", contact);

            if(!!!contact) {
                // console.log("The contact doesn't exist");
                //check to see if a contact request has been sent
                contactrequestdb.contactRequestModel.findOne({receiverId: currentUserId, senderId: checkUserId})
                .exec(function(err, contactRequest) {
                    if (err) {
                        console.log(err);
                        return res.status(401).json({error: "Please try again later"});
                    }
                    // console.log('checking contact request', contactRequest);
                    if(!!!contactRequest) {
                        // console.log('contact reqwuest doesnt exist');
                        return res.status(200).json(new contactsController.ContactSMessage(contactsController.CONTACT_STATUS.NO_CONNECTION.CODE, contactsController.CONTACT_STATUS.NO_CONNECTION.STATUS));
                    }
                    return res.status(200).json(new contactsController.ContactSMessage(contactsController.CONTACT_STATUS.PENDING_REQUEST.CODE, contactsController.CONTACT_STATUS.PENDING_REQUEST.STATUS));
                });

            }
            if (contact) {
                return res.status(200).json(new contactsController.ContactSMessage(contactsController.CONTACT_STATUS.IN_CONTACTS.CODE, contactsController.CONTACT_STATUS.IN_CONTACTS.STATUS));
            }

        });
} ;      

apiVerifyContact.PATH = '/api/contact/verify';
apiVerifyContact.METHOD = 'POST';
// apiVerifyContact.MSG_TYPE = message.VerifyContactMessage;
apiVerifyContact.TOKEN_VALIDATE = true;
apiVerifyContact.ROLE_REQUIRED = ['admin', 'user'];

/**
 * Get Contact stats to display on profile e.g. total contacts / pending contacts
 * @param  {Object} req 
 * @param  {Object} res 
 * @return {Object}     
 */
var apiGetContactStats = function (req, res) {
  
    if (!!!req.session.user._id) {
        console.log('no current user');
        return
    }

    var currentUserId = req.session.user._id;
    
    var contactStats = {
        contactsTotal: '',
        contactsPendingTotal: ''
    };


    async.waterfall([ function(done) {
            
            contactlistdb.contactModel
            .find({ownerId: currentUserId})
            .count()
            .exec(function (err, totalcontacts){
                if (err) {
                    console.log(err);
                    return res.status(401).json({error: ""});
                }

            if (totalcontacts) {
                contactStats.contactsTotal = totalcontacts;
            }
              done(err, contactStats);
            });            
        },

        function(contactStats, done) {
            contactrequestdb.contactRequestModel
            .find({receiverId: currentUserId, accepted: false})
            .count()
            .exec(function(err, totalrequests) {
                if (err) {
                    console.log(err);
                    return res.status(401);
                }

                if (totalrequests !== undefined) {
                    contactStats.contactsPendingTotal = totalrequests;
                    return res.status(200).json({stats: contactStats});
                }
                done(err);
            });           
        }

    ], function (err) {
        if (err) {
            console.log('error is', err)
            return res.status(500).json({error: "Can no retrieve contact stats atm."}); 
        }
    });
    
};
apiGetContactStats.PATH = '/api/contact/stats';
apiGetContactStats.METHOD = 'GET';
apiGetContactStats.TOKEN_VALIDATE= true;
apiGetContactStats.ROLE_REQUIRED= ['admin', 'user'];

/**
* Get Users Activity feed to show which rooms have been created
* @param {Object} req
* @param {Object} res
* @constructor
*/
var apiGetActivityFeed = function (req, res) {
  console.log('received request for activity feed')
   // console.log('get contact request');

  var ownerId = req.session.user._id || null;
  var ids;
  var contactRooms;

 async.waterfall([ function (done) {

  //TODO: GET CONTACTS OF USERS THAT HAVE BEEN MUTUALLY ACCEPTED
  contactlistdb.contactModel.find({ownerId: ownerId, accepted: true})   //GET ARRAY OF USERS CONTACT IDS
    .sort({_id: -1}) 
    .populate({
        path: 'contactAddId',
        select:'_id username'
    })
    .exec(function(err, contacts) {
        if (err) {
            console.log(err);
            return res.status(500).json({error:'Please try again in a bit'});
        }

        if (contacts) {
            console.log('contacts', contacts);
            ids =  activityController.activity.extractContactIds(contacts);
           done(err, ids);
        }
    });

  }, function (ids, done) {

   // GET ROOMS OF CONTACT IDS
   userdb.userModel.aggregate([
    { $match: { _id: {$in: ids}}},
    // { $group : {_id: { room: { $slice: ["$room", -5]}}}} uncomment when mongolab mongodb updated to 3.2 
    { $group : {_id: { room: "$room"}}} 
   ])
    .exec(function(err, users) {
        if (err) {
            console.log(err);            
            return res.status(500).json({error:'Please try again in a bit'});
        }
        if (users) {
            done(err, users);
        }
    });    

  }, function(users, done) {
        var options = {
            path: "_id.room ",  
            options: {limit: 5, sort: { 'created': -1 } },
            model: 'Room'
        };
        
        userdb.userModel.populate(users, options, function(err, populatedRooms){
        if (err) {
            console.log(err);
            return res.status(500).json({error:'Please try again in a bit'});
        }
        // get all the room ids in one rooms object
        if (populatedRooms) {
        // use promise?
           contactRooms = activityController.activity.processRooms(populatedRooms);

           userdb.userModel.populate(contactRooms, {path:"_creator", select:"_id username"}, function (err, rooms) {
            if (err) {
                console.log(err);
                return res.status(500).json({error:'Please try again in a bit'});
            }
            return res.status(200).json({success: rooms});
            
           });
         } 
            done(err);
        });       

  }], function (err) {
    if (err) {
        console.log('erorr in activity ', err);
        return res.status(500).json({error: 'Cannot retreive activity atm.'});
    }
  })

}
apiGetActivityFeed.PATH = '/api/activity/get';
apiGetActivityFeed.METHOD = 'GET';
apiGetActivityFeed.TOKEN_VALIDATE = true;
apiGetActivityFeed.ROLE_REQUIRED= ['admin', 'user'];


exports.apiLogin = apiLogin;
exports.apiLogout = apiLogout;
exports.apiSignup = apiSignup;
exports.apiProfileDetail = apiProfileDetail;
exports.apiGetTotalProfiles = apiGetTotalProfiles;
exports.apiGetRecentProfiles = apiGetRecentProfiles;
exports.apiProfileEdit = apiProfileEdit;
exports.apiGetViewerProfile = apiGetViewerProfile;
exports.apiRoomCreate = apiRoomCreate;
exports.apiGetRoom = apiGetRoom;
exports.apiGetTotalRooms = apiGetTotalRooms;
exports.apiRoomUpdateSocket = apiRoomUpdateSocket;
exports.apiRoomGetSocket = apiRoomGetSocket;
exports.apiUpdateGuestList = apiUpdateGuestList;
exports.apiGetGuestListTotal = apiGetGuestListTotal;
exports.apiForgotPassword = apiForgotPassword;
exports.apiPostPasswordToken = apiPostPasswordToken;
exports.apiInviteFriend = apiInviteFriend;
exports.apiCreateContact = apiCreateContact;
exports.apiGetContacts = apiGetContacts;
exports.apiGetPendingContacts = apiGetPendingContacts;
exports.apiAcceptPendingContacts = apiAcceptPendingContacts;
exports.apiVerifyContact = apiVerifyContact;
exports.apiGetActivityFeed = apiGetActivityFeed;




var Routes = {
    '/api/login': apiLogin,
    '/api/signup' : apiSignup,
    '/api/profile': apiProfileDetail,
    '/api/profile/total' :apiGetTotalProfiles,
    '/api/profile/recent' :apiGetRecentProfiles,
    '/api/profile/edit': apiProfileEdit,
    '/api/profile/:id' :apiGetViewerProfile,
    '/api/room/total': apiGetTotalRooms,                 
    '/api/room/create': apiRoomCreate,              
    '/api/room/:id': apiGetRoom,                 
    '/api/socket/room': apiRoomUpdateSocket,              
    '/api/socket/room/:id': apiRoomGetSocket,              
    '/api/logout': apiLogout,
    '/api/requestinvite' : apiUpdateGuestList,
    '/api/guestlist/total' : apiGetGuestListTotal,
    '/api/invite/friend' : apiInviteFriend,
    '/api/forgot' : apiForgotPassword,
    '/reset/:token' : apiGetPasswordToken,
    '/api/reset/:token': apiPostPasswordToken,
    '/api/contact/create': apiCreateContact,
    '/api/contact/search': apiSearchContact,
    '/api/contacts/get':apiGetContacts,
    '/api/contact/pending/get': apiGetPendingContacts,
    '/api/contact/accept':apiAcceptPendingContacts,
    '/api/contact/verify':apiVerifyContact,
    '/api/contact/stats': apiGetContactStats,
    '/api/activity/get': apiGetActivityFeed
};

/**
 * Checks to see if the current user has access based on its role
 * @param  {Array} userReqRole Contains the array with current user roles
 */
var checkUserRole = function(userReqRole) {
    if (typeof userReqRole == 'object') {
       return role.verifyUserRole(userReqRole);           
    }
};

exports.dispatch = function(app) {

    for(var key in Routes) {
        var handler = Routes[key];
        if(typeof handler !== 'function') continue;
        var validateParamFunc = typeof handler.MSG_TYPE == 'function' ? message.validateParams(new handler.MSG_TYPE()) : function(req, res, next) {next();};
        var authFunc = !!handler.TOKEN_VALIDATE ? jwt({secret: secret.secretToken}) : function(req, res, next) {next();};

 
        if(handler.METHOD == 'POST') {
            app.post(key, checkUserRole(handler.ROLE_REQUIRED), authFunc, validateParamFunc, handler);
        }

        if(handler.METHOD == 'GET') {
            app.get(key, checkUserRole(handler.ROLE_REQUIRED), authFunc, validateParamFunc, handler);
        }

        if(handler.METHOD == 'PUT') {
            app.put(key, checkUserRole(handler.ROLE_REQUIRED), authFunc, validateParamFunc, handler);
        }
    }

};


