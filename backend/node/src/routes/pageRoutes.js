/**
 * This file provides page load services
 */
var path = require('path')

exports.pageAbout = function(req, res){
    res.render('about');
}

exports.pageInviteonly = function(req, res){
    res.render('inviteonly');
}

exports.pageRequestInvite = function(req, res){
    res.render('requestInvite');
}

exports.pageRecentlyJoined = function(req, res){
    res.render('recentlyJoined');
}

exports.pageForgotPassword = function(req, res)
{
    res.render('forgotPassword');
}

exports.pageResetPassword = function (req, res)
{
    res.render('resetPassword');
}

exports.pageWelcome = function(req, res) 
{

    res.render('welcome');
}


exports.pageLogin = function(req, res) 
{
    res.render('login');
}

exports.pageLogout = function(req, res) 
{
    res.render('welcome');
   // res.status(200);
}

exports.pageSignup = function(req, res) 
{
    res.render('signup');
}

exports.pageProfile = function(req, res) 
{
   res.render('profile');
}

exports.pageProfileEdit = function(req, res) 
{   
    res.render('profileEdit');
}

exports.pageProfileUrlView = function(req, res) 
{    
    res.render('profileView');
}

exports.pageRoom = function(req, res){
    res.render('room');
}

exports.pageAdmin = function(req, res){
    res.render('admin');
}




exports.loadPage = function(req, res) {
    var template = path.basename(req.path, '.html');
    //send page
    res.render(template, function(err, html) {
        if(err) {
            res.redirect('/');
        } else {
            res.end(html);
        }
    });
}


