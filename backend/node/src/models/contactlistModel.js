/**
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
var ContactListSchema = new Schema({

	ownerId: {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
	},

	contactAddId: {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : true
	},

	accepted: {
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

ContactListSchema.index({ownerId: 1, contactAddId: 1 }, { unique: true });

var contactModel = mongoose.model('ContactList', ContactListSchema);
exports.contactModel = contactModel;