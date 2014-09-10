/**
 * @fileoverview
 */

exports.apiLogin= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log(req);
    res.send("login success");
}

exports.apiSignup= function(req, res) {
    //send page
    console.log("receive request \n");
    console.log(req);
    res.send("signup success");
}