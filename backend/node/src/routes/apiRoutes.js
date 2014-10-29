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
apiLogin.TOKEN_VALIDATE = true;

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

            /******************************Not Clear about what are u going to do? ******************************************/
            //TODO: Improve admin handling
            if (counter == 1) {
                db.userModel.update({email:user.email}, {privileges:'admin'}, function(err, nbRow) {
                    if (err) {
                        console.log(err);
                        return res.status(500).end();
                    }

                    console.log('User created');
                    var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
                    return res.status(200).json({token: token});

                });
            }
            else {
                var token = jwtoken.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
                return res.status(200).json({token: token});
            }
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
    console.log("receive request \n");

     db.userModel.findOne({ _id: req.user.id}, function (err, user) {
        if (err) {
            console.log(err);
            //return res.send(401);
            return res.status(401).end();
        }

        if (user == undefined) {
            //return res.send(401);
            return res.status(401).end();
        }

        //console.log(user);
        return res.status(200).send(user);
    });
};
apiProfile.PATH = '/api/profile';
apiProfile.METHOD = 'GET';
apiProfile.TOKEN_VALIDATE = true;

exports.apiLogin = apiLogin;
exports.apiLogout = apiLogout;
exports.apiSignup = apiSignup;
exports.apiProfile = apiProfile;

var Routes = {
    '/api/login': apiLogin,
    '/api/signup' : apiSignup,
    '/api/profile': apiProfile,
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
    }

}

