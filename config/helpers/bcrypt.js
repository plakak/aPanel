var bcrypt = require('bcrypt');

exports.encrypt = function(plainText, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(plainText, salt, function(err, hash) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, hash);
            }
        });
    });
};

exports.check = function(plainText, encodedHash, callback) {
    bcrypt.compare(plainText, encodedHash, function (err, isMatch) {
        if (!err && isMatch) {
            callback(null, true);
        } else callback('error', err, isMatch);
    });
};