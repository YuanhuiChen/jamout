/**
 * This file provide api handlers
 */

 var userdb     = require(PROJECT_ROOT + '/models/userModel'),
     roomdb     = require(PROJECT_ROOT + '/models/roomModel'),
     mongoose   = require('mongoose'),
     jwtoken    = require('jsonwebtoken'), //JSON web token sign and verification 
     jwt        = require('express-jwt'), // authentication middleware
     secret     = require(PROJECT_ROOT + '/config/secret'),
     message    = require(PROJECT_ROOT + '/models/messageModel'),
     socket     = require(PROJECT_ROOT + '/routes/socket.js');




/**
 * Login
 */

var apiLogin= function(req, res) {
    //send page

    if(!!!res.isValidParams) {
        return;
    }
    console.log("receive login request \n");

    //console.log(req);
    var email    = req.body.email || '';
    var password = req.body.password || '';

    // do in validate middleware
    /*if (email == '' || password == '') {
       return res.status(401).end();
    }*/
    
    
    userdb.userModel.findOne({email: email}, function (err, user) {

        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (user == undefined) {
            return res.status(401).end();
        }

        user.verifyPassword(password, function(isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.email);
                return res.status(401).end();
            }

            var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
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
/**
 * Logout
 */
var apiLogout= function (req, res) {
    console.log(req.headers);

    if (req.user) {
        delete req.user;
        return res.status(200).end();
    }
    else {
        return res.status(401).end();
    }
 }
apiLogout.PATH = '/api/logout';
apiLogout.METHOD = 'GET';
apiLogout.TOKEN_VALIDATE = true;

/**
 * Signup
 *
 */
var apiSignup= function(req, res) {

    if(!!!res.isValidParams) {
         return;
     }



    //send page
    console.log("receive sigun up request \n");
    //console.log(req);

    var email = req.body.email || '';
    var username = req.body.username || '';
    var about = req.body.about || '';
    var location = req.body.location || '';
    var url = req.body.url || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

   /* if ( email == '' || password == '' || password != passwordConfirmation) {
            return res.status(400).end();
    }*/

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
    console.log(user);
    /******************************Check Existing User First? Otherwise give duplicate results******************************************/
    /*____________________________Checking existing user directly in userModel.js before user.save is called_____________________________________________*/
   

    user.save(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
                 
             console.log('User created');
             var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
             return res.status(200).json({token: token});
              
    });
};      
apiSignup.PATH = '/api/signup';
apiSignup.METHOD = 'POST';
apiSignup.MSG_TYPE = message.SignupRequestMessage;
apiSignup.TOKEN_VALIDATE = false;

/**
 * Get user profile detail
 *
 */
var apiProfileDetail= function(req, res) {
    //send page
    //console.log(req.headers);
    console.log("receive request for apiProfileDetail \n");

     userdb.userModel.findOne({ _id: req.user.id}, 
      // 0 excludes the fields
      { password: 0, room: {$slice: -5}},
      function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        // do this in message middleware
        if (user == undefined) {
            return res.status(401).end();
        }

       // console.log(user);
        return res.status(200).send(user);
    });
};

apiProfileDetail.PATH = '/api/profile';
apiProfileDetail.METHOD = 'GET';
apiProfileDetail.TOKEN_VALIDATE = true;

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
    
     userdb.userModel.findByIdAndUpdate({ _id: req.user.id}, {$set: data}, function (err, user) {
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


/**
 * Get user url profile
 *
 */
//TODO: limit the rooms returned by {$lte: 10}
var apiGetProfile= function(req, res) {
    //send page
    // console.log(req.params);
    // console.log("receive request mofo");

     userdb.userModel.findOne({ _id: req.params.id}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
    //     // do this in message middleware
    //     if (user == undefined) {
    //         return res.status(401).end();
    //     }

       // console.log(user);
        return res.status(200).send(user);
    });
};
apiGetProfile.PATH = '/api/profile/:id';
apiGetProfile.METHOD = 'GET';
apiGetProfile.TOKEN_VALIDATE = false;

// //TODO ROUTES
// app.get('/api/users', checkUser, db, routes.users.getUsers);
// app.post('/api/users', checkAdmin, db, routes.users.add);
// app.put('/api/users/:id', checkAdmin, db, routes.users.update);
// app.del('/api/users/:id', checkAdmin, db, routes.users.del);

//todo implementation purposely delayed
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
//TODO INCOMPLETE IMPLEMENTATION
var apiRoomCreate = function(req, res) {
    // console.log("receive request \n");
     //console.log(req);

    if(!!!res.isValidParams) {
        return;
    }

     if (!req.user) {
        return res.send(401);
     }

     var title = req.body.title;
     var userId = req.user.id;
     
     if (title == null) {
        return res.status(400).end();
     }
     
     var room = new roomdb.roomModel();
     room.title = title;
     room._creator = userId;
      

        room.save(function (err, room) {
        if (err) {
            console.log(err);
            return res.status(400).end();
        }
       
       /*******************how do I limit the room Array data I'm receiving***********************/ 
        roomdb.roomModel
        .findOne({title: room.title})
        .populate({ 
            path : '_creator',
            select : 'room _id username' 
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
     
}


apiRoomCreate.PATH = '/api/room/create';
apiRoomCreate.METHOD = 'POST';
apiRoomCreate.MSG_TYPE = message.RoomCreateRequestMessage;
apiRoomCreate.TOKEN_VALIDATE = true;  



/**
 * Get room url detail
 *
 */
var apiGetRoom= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log("req param id" + req.param("id"));

     roomdb.roomModel
     .findOne({ _id: req.params.id})
     .populate({ 
            path : '_creator',
            select : '_id username'
            })
     .exec(function (err, room) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        
         if (room == undefined) {
            return res.status(401).end();
        }

        return res.status(200).send(room);
    });
};
apiGetRoom.PATH = '/api/room/:id';
apiGetRoom.METHOD = 'GET';
apiGetRoom.TOKEN_VALIDATE = false;


exports.apiLogin = apiLogin;
exports.apiLogout = apiLogout;
exports.apiSignup = apiSignup;
exports.apiProfileDetail = apiProfileDetail;
exports.apiProfileEdit = apiProfileEdit;
exports.apiGetProfile = apiGetProfile;
exports.apiRoomCreate = apiRoomCreate;
exports.apiGetRoom = apiGetRoom;


var Routes = {
    '/api/login': apiLogin,
    '/api/signup' : apiSignup,
    '/api/profile': apiProfileDetail,
    '/api/profile/edit': apiProfileEdit,
    '/api/profile/:id' :apiGetProfile,
    '/api/room/create': apiRoomCreate,              
    '/api/room/:id': apiGetRoom,                 
    '/api/logout': apiLogout
}

exports.dispatch = function(app) {

    for(var key in Routes) {
        var handler = Routes[key];
        if(typeof handler !== 'function') continue;
        var validateParamFunc = typeof handler.MSG_TYPE == 'function' ? message.validateParams(new handler.MSG_TYPE()) : function(req, res, next) {next()};
        var authFunc = !!handler.TOKEN_VALIDATE ? jwt({secret: secret.secretToken}) : function(req, res, next) {next()};
        if(handler.METHOD == 'POST') {
            app.post(key, authFunc, validateParamFunc, handler);
        }

        if(handler.METHOD == 'GET') {
            app.get(key, authFunc, validateParamFunc, handler);
        }

        if(handler.METHOD == 'PUT') {
            app.put(key, authFunc, validateParamFunc, handler);
        }
    }

}

