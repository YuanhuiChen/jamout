/**
 * @fileoverview
 */

exports.pageWelcome = function(req, res) {
    //send page
    res.render('welcome');
}


exports.pageLogin = function(req, res) {
    //send page
    res.render('login');
}
