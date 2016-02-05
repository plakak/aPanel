var mongoose = require('mongoose');
var bcrypt = require('../helpers/bcrypt');

    const userSchema = mongoose.Schema({
        user: String,
        password: String
    });

    userSchema.methods.validPassword = function(pwd, callback) {
       bcrypt.check(pwd, this.password, function(err) {
           if (!err) {
               callback(null, true)
           } else callback(err);
       });
    };

    const User = mongoose.model('Tests', userSchema);


module.exports = {
    User: User
};


