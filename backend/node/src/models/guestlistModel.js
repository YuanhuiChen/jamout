/**
* @fileoverview
*/

var mongoose = require('mongoose');
//define the schema for our user model
var Schema = mongoose.Schema;

/**
 * @constructor
 */
var GuestlistSchema = new Schema({
    

    email : {  
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    url : {
        type: String
    },
    
    invited : {
      type: Boolean,
      default: false
    },
   created : {
        type: Date,
        default: Date.now
   }
   
});


/**
 * Execute before each guestlist.save() call
 * @type {function(string, *)}
 */
GuestlistSchema.pre('save', function(next){
    var guestlist = this;
    // check if user exists
    guestlistModel.find({email: guestlist.email}, function (err, docs) {
        if (!docs.length){
            next();
        }else{               
            console.log('email exists: \n',guestlist.email);
            return next(); // break out if user exists
        }
    });

});


// Export the Mongoose model

var guestlistModel = mongoose.model('Guestlist', GuestlistSchema);
exports.guestlistModel = guestlistModel;