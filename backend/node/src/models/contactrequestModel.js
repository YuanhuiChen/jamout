/**
* To store data for request when user adds another user. 
* To show pending requests
* @fileoverview
*/
var mongoose = require('mongoose'),
	userdb = require(PROJECT_ROOT + '/models/userModel');
/** 
 * @cosnt 
 */
var Schema = mongoose.Schema;

/**
*
*/
var ContactRequestSchema = new Schema({

	senderId: {
        type : Schema.Types.ObjectId,
        ref : 'User',
		required : true
	},

	receiverId: {
		type :  Schema.Types.ObjectId,
		ref : 'User',
		required : true
	},

	accepted : {
		type: Boolean,
		default: false
	},

	created : {
		type: Date,
		default: Date.now
	},

	updated : {
		type: Date
	}
})

ContactRequestSchema.index({senderId: 1, receiverId: 1 }, { unique: true });

var contactRequestModel = mongoose.model('ContactRequest', ContactRequestSchema);
exports.contactRequestModel = contactRequestModel;