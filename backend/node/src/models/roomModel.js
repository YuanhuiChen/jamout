/**
* @fileoverview
*/

var mongoose = require('mongoose');


//define the schema for our user model
var Schema = mongoose.Schema;

/**
 * @constructor
 */
var RoomSchema = new Schema({
    

    title : {  
        type: String,
        required: true
    },

    created : {
        type: Date,
        default: Date.now
   }
   
});



// Export the Mongoose model
var roomModel = mongoose.model('Room', RoomSchema);
exports.roomModel = roomModel;