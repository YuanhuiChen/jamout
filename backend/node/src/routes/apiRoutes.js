/**
 * This file provide api handlers
 */

 var db         = require(PROJECT_ROOT + '/models/userModel'),
     mongoose   = require('mongoose'),
     jwtoken    = require('jsonwebtoken'), //JSON web token sign and verification 
     jwt        = require('express-jwt'), // authentication middleware
     secret     = require(PROJECT_ROOT + '/config/secret'),
     message    = require(PROJECT_ROOT + '/models/messageModel');




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


    db.userModel.findOne({email: email}, function (err, user) {
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
            console.log(token);
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
     * @type {db.UserSchema}
     */
    var user = new db.userModel();
    user.email = email;
    user.username = username;
    user.about = about;
    user.location = location;
    user.url = url;
    user.password = password;

    /******************************Check Existing User First? Otherwise give duplicate results******************************************/
    db.userModel.findOne({email: user.email}, function (err, user){ 
        if (err) {
            console.log(err);
            return res.status(500).end();
        }

        //which http code should i use?
        if (user) {
            return res.status(400).send({ message: 'user already exists'});
        } 
     });

        user.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log(user);

            db.userModel.count(function (err, counter) {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }           
                    console.log('User created');
                    var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
                    return res.status(200).json({token: token});
                
            });
        });

};
apiSignup.PATH = '/api/signup';
apiSignup.METHOD = 'POST';
apiSignup.MSG_TYPE = message.SignupRequestMessage;
apiSignup.TOKEN_VALIDATE = false;

var apiProfile= function(req, res) {
    //send page
    //console.log(req.headers);
    console.log("receive request for apiProfile \n");

     db.userModel.findOne({ _id: req.user.id}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
        // do this in message middleware
        if (user == undefined) {
            return res.status(401).end();
        }

        return res.status(200).send(user);
    });
};
apiProfile.PATH = '/api/profile';
apiProfile.METHOD = 'GET';
apiProfile.TOKEN_VALIDATE = true;

var apiProfileEdit= function(req, res) {

    if(!!!res.isValidParams) {
         return;
     }

    //send page
    
    
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
    
     db.userModel.findByIdAndUpdate({ _id: req.user.id}, {$set: data}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (!user) {
            return res.status(401).end();
        }
        console.log(user);
        return res.status(200).send(user);
    });
};
apiProfileEdit.PATH = '/api/profile/edit';
apiProfileEdit.METHOD = 'PUT';
apiProfileEdit.MSG_TYPE = message.ProfileEditRequestMessage;
apiProfileEdit.TOKEN_VALIDATE = true;


// app.get('/api/users/:id', checkUser, db,routes.users.getUser);
var apiGetProfile= function(req, res) {
    //send page
    console.log(req.params);
    console.log("receive request mofo");

     db.userModel.findOne({ _id: req.params.id}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }
    //     // do this in message middleware
    //     if (user == undefined) {
    //         return res.status(401).end();
    //     }

        console.log(user);
        //return res.status(200).send(user);
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


exports.apiLogin = apiLogin;
exports.apiLogout = apiLogout;
exports.apiSignup = apiSignup;
exports.apiProfile = apiProfile;
exports.apiProfileEdit = apiProfileEdit;
exports.apiGetProfile = apiGetProfile;


var Routes = {
    '/api/login': apiLogin,
    '/api/signup' : apiSignup,
    '/api/profile': apiProfile,
    '/api/profile/edit': apiProfileEdit,
    '/api/profile/:id' :apiGetProfile,
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

