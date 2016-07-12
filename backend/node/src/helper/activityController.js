"use strict"
/**
* Contains the logic for the ActivityAPI
* @fileoverview
*/

var _ = require('underscore');

/** 
* Activity Controller
* @constructor
*/
var activityController = function () {};

/**
* Proces, clean up and sort rooms returned by mongodb activity api
* @param {Object} rooms - Users Rooms that need to be cleaned up
* @returns {Object} - Returns an array of rooms in an object
*/
activityController.prototype.processRooms = function (rooms) {
   /** @type {Object} */
   this.rooms = rooms || {};
   
   /** @const */
   var roomsList,
       slicedRooms, 
       flattendRoomsList, 
       sortedRooms;
    
    /**
	* Extracts rooms from the object and returns an array of them
	* @param {Object} rooms - object with array of rooms 
	* @returns {Array}
	*/
	var extractRooms = function (rooms) {
	  
	   /** @type {Array} */
	   var roomArrays = [];
	  _.each(rooms, function (object){
	  	/** @type {Array} */
	    var roomArray = object._id.room;
	      if (roomArray.length > 0) {   
	             	roomArrays.push(roomArray);	      	
	      }
	  });
	   return roomArrays;
	};

	/**
	* Sorts rooms by date in descending order from the latest room date being the first
	* @param {Array} roomsList - Array of rooms
	* @returns {Array}
	*/
	var sortRoomsByDate = function (roomsList) {
		/** @const */	
	   var sortedArray, 
	   	   descendingRooms;  
	    
	    sortedArray = _.sortBy(roomsList, function (o){   
	        return o.created;
	    });
	    
	   descendingRooms= sortedArray.reverse();
	  
	   return descendingRooms;
	};

	/**
	* Slice rooms so only return at max 10 docs
	* @param {Array} roomList - Array of rooms to slice
	* @param {Number} sliceLength - length to slice to
	* @returns {Array}
	*/
	var sliceRooms = function (roomList, sliceLength) {
		/** @const */
		var length = roomList.length;
		/** @const */
		var sLength = sliceLength;
		/** @const */
		var sliced;

		sliced = length <= 10 ? roomList : roomList.slice(0, sLength);
		return sliced;

	};

    roomsList = extractRooms(rooms);
    flattendRoomsList = _.flatten(roomsList);  
    slicedRooms = sliceRooms(flattendRoomsList, 10)
    sortedRooms = sortRoomsByDate(slicedRooms);

    
    return sortedRooms;
};

var activity = new activityController();
exports.activity = activity;

