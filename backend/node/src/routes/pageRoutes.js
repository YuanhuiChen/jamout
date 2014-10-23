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
