var bcrypt = require('bcrypt');

exports.encrypt = plainText => {
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(plainText, salt, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                     resolve(hash);
                 }
            });
        });
    });
};

exports.check = function(plainText, encodedHash) {

    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, encodedHash, (err, isMatch) => {
            if (!err && isMatch) {
                resolve();
            } else reject(err);
        });
    })
};