/**
* @fileoverview
*/

var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

//define the schema for our user model


var Schema = mongoose.Schema;
var UserSchema = new Schema({
    

    email : {  
        type: String,
        unique: true,
        required: true
    },
   
    password  : {
        type: String,
        unique: true,
        required: true
   },
   
});

// // Execute before each user.save() call
// UserSchema.pre('save', function(callback){
//     var user = this;

//     // Break out if the password hasn't chnaged
//     if(!user.isModified('password')) return callback();

//     // Password changed so we need to hash it
//     bcrypt.genSalt(8, function(err, salt) {
//         if (err) return callback(err);

//         bcrypt.hash(user.password, salt, null, function(err, hash) {
//             if (err) return callback(err);
//             user.password = hash;
//             callback();
//         });
//     });
// });

// UserSchema.methods.verifyPassword = function(password, cb) {
//     bcrypt.compare(password, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
