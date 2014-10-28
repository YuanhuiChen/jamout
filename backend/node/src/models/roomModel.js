/**
* @fileoverview
*/

var mongoose = require('mongoose'),
    userdb = require(PROJECT_ROOT + '/models/userModel');


//define the schema for our user model
var Schema = mongoose.Schema;

/**
 * @constructor
 */
var RoomSchema = new Schema({
    
    _creator : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

    title : {  
        type: String,
        required: true,
        trim: true
    },

    created : {
        type: Date,
        default: Date.now
   }
   
});



// Export the Mongoose model
var roomModel = mongoose.model('Room', RoomSchema);
exports.roomModel = roomModel;