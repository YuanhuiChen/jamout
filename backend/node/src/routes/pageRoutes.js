/**
 * @fileoverview
 */

exports.pageWelcome = function(req, res) 
{
    //send page
    res.render('welcome');
}


exports.pageLogin = function(req, res) 
{
    //send page
    res.render('login');
}

exports.pageLogout = function(req, res) 
{
    //send page
    res.render('welcome');
   // res.status(200);
}

exports.pageSignup = function(req, res) 
{
    //send page
    res.render('signup');
}

exports.pageProfile = function(req, res) 
{
    //send page
    res.render('profile');
}
