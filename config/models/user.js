var mongoose = require('mongoose');
var bcrypt = require('../helpers/bcrypt');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

userSchema.methods.validPassword = function(pwd, callback) {
   bcrypt.check(pwd, this.password, function(err) {
       if (!err) {
           callback(null, true)
       } else callback(err);
   });
};

const User = mongoose.model('Users', userSchema);

const addUser = function(req, callback) {
    bcrypt.encrypt(req.body.password, function(err, encPasswd) {
        if (!err) {
            var register_data = {
                username: req.body.username,
                password: encPasswd
            };

            var newUser = new User(register_data);

            newUser.save(function (error, data) {
                if (!error) {
                    callback(null, data);
                } else callback(error, null);
            });

        } else callback(err, null);
    });
};

module.exports = {
    User: User,
    addUser: addUser
};


