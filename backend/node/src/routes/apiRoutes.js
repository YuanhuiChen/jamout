/**
 * @fileoverview
 */

 var db         = require(PROJECT_ROOT + '/models/userModel'),
     mongoose   = require('mongoose'),
     jwt        = require('jsonwebtoken'),
     secret     = require(PROJECT_ROOT + '/config/secret');

/**
 * Login
 */

exports.apiLogin= function(req, res) {
    //send page
    console.log("receive request \n");
    //console.log(req);
    var email    = req.body.email || '';
    var password = req.body.password || '';

    if (email == '' || password == '') {   
       return res.status(401).end();
    }
    
    
    db.userModel.findOne({email: email}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).end();
        }

        if (user == undefined) {            
            return res.status(401).end();
        }
        
        user.verifyPassword(password, function(isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.email);   
                return res.status(401).end();
            }

            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
            //console.log(token);
            res.status(200).json({token: token});
        });
    });
    
    //res.send("login success");
};

/**
 * Login
 */
 exports.apiLogout= function (req, res) {
    console.log(req.headers);

    if (req.user) {
        delete req.user;
        return res.status(200).end();
    }
    else {
        return res.status(401).end();
    }
 }

/**
 * Signup
 *
 */


exports.apiSignup= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log(req);

    var email = req.body.email || '';
    var username = req.body.username || '';
    var about = req.body.about || '';
    var location = req.body.location || '';
    var url = req.body.url || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

    if ( email == '' || password == '' || password != passwordConfirmation) {
            return res.status(400).end();
    }

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

            //TODO: Improve admin handling
            if (counter == 1) {
                db.userModel.update({email:user.email}, {privileges:'admin'}, function(err, nbRow) {
                    if (err) {
                        console.log(err);
                        return res.status(500).end();
                    }

                    console.log('User created');
                    var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
                    return res.status(200).json({token: token});

                });
            } 
            else {
                var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: 60 });
                return res.status(200).json({token: token});
            }
        });
    });

};

exports.apiProfile= function(req, res) {
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
