/**
 * @fileoverview
 */

// exports.apiLogin= function(req, res) {
//     //send page
//     console.log("receive request \n");
//     console.log(req);
//     res.send("login success");
// }

exports.apiLogin = function(req, res) {
    var email    = req.body.username || '';
    var password = req.body.password || '';

    if (email == '' || password == '') {
        return res.send(401);
    }

    db.userModel.findOne({username: username}, function (err, user) {
        if (err) {
            console.log (err);
            return res.send(401);
        }

        user.comparePassword(password, function(isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with" + user.email);
                return res.send(401);
            }

            var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });

            return res.send({token: token});
        });
    });
};

exports.apiSignup= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log(req);
    res.send("signup success");
}

exports.apiProfile= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log(req);
    res.send("response success");
}