const mongoose = require('mongoose'); // require mongoose 
const Schema = mongoose.Schema; // shortcut (to simplify)
const passportLocalMongoose = require('passport-local-mongoose'); // plugin tp simplify building logins

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
/* 
- adds username and password to our schema
- makes sure the username is unique
- gives us additional methods we can use 
*/



module.exports = mongoose.model('User', UserSchema);

 