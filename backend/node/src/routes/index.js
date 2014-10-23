/**
 * @fileoverview
 */

var apiRoutes    = require('./apiRoutes');
var pageRoutes = require('./pageRoutes');
var message = require(PROJECT_ROOT + '/models/messageModel');
var jwt        = require('express-jwt');

//Register all groups of apis

exports.dispatch = function(app) {
    apiRoutes.dispatch(app);
}
