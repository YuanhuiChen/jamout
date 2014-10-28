/**
* @fileoverview
*/

var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'), // bcrypt-nodejs instead of bcrypt because it works well with windows
    roomdb   = require(PROJECT_ROOT + '/models/roomModel');
//define the schema for our user model
var Schema = mongoose.Schema;

/**
 * @constructor
 */
var UserSchema = new Schema({
    

    email : {  
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    username : {  
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    about : {  
        type: String
    },

    location : {  
        type: String
    },

    url : {  
        type: String
    },
   
    password  : {
        type: String,
        required: true
   },

   is_admin : {
        type: Boolean,
        default: false
   },

   privileges : {
        type: String,
        default: null
   },

   room : [{
         type: Schema.Types.ObjectId,
         ref: 'Room'
   }],

   created : {
        type: Date,
        default: Date.now
   }
   
});


/**
 * Bcrypt middleware on UserSchema
 * Execute before each user.save() call
 * @type {function(string, *)}
 */
UserSchema.pre('save', function(next){
    var user = this;

    // Break out if the password hasn't chnaged
    if(!user.isModified('password')) return next();

    // Password changed so we need to hash it
    bcrypt.genSalt(8, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
/**
 *
 * @param password
 * @param cb
 * @expose
 * @type {function(string, *)}
 */
UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password,  function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

// Export the Mongoose model
//module.exports = mongoose.model('User', UserSchema);

var userModel = mongoose.model('User', UserSchema);
exports.userModel = userModel;