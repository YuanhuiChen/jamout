/**
 * This file provides page load services
 */
var path = require('path')
exports.pageWelcome = function(req, res) 
{
    //send page
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

exports.pageProfileView = function(req, res) 
{    
    res.render('profileView');
}

exports.pageRoom = function(req, res){
    res.render('room');
}

/********************TODO FOR VIEW PAGE ****************/

// exports.pageRoomUrlView = function(req, res) 
// {
//     //send page
//     res.render('room', {_id: req.params.id});
// }


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


