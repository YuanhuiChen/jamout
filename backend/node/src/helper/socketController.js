"use strict"
/**
* Contains the logic to update socket live status in room Model
* @fileoverview
*/
var roomdb     = require(PROJECT_ROOT + '/models/roomModel');

/**
* Socket Controller
* @constructor
*/
var socketController = function () {};

/**
* @param {String} socketId - Socket Id to disconnect in room model
*/
socketController.prototype.disconnect = function (socketId) {
   this.id = socketId || "";

	roomdb.roomModel
	  .findOne({socket: this.id})
	  .exec(function (err, room){
	      if (err) {
	          console.log(err);
	          return;
	      }            
	       if (room === undefined) {
	          return;
	      }	      
	      room.live = false;
	      room.save();
	  });   
}

var socket = new socketController();
exports.socket = socket;