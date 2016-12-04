const mongoose = require('mongoose');
const bcrypt = require('../helpers/bcrypt');

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  lastLogin: Date
});

userSchema.methods.validPassword = function (pwd) {
  return new Promise((resolve, reject) => {
    bcrypt.check(pwd, this.password)
      .then(() => resolve())
      .catch(err => reject(err));
  })
};

const User = mongoose.model('Users', userSchema);

const addUser = req => {
  
  return new Promise((resolve, reject) => {
    bcrypt.encrypt(req.body.password)
      .then(encPasswd => {
        const register_data = {
          username: req.body.username,
          password: encPasswd
        };
        const newUser = new User(register_data);
        newUser.save((error, data) => {
          if (!error) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      })
      .catch(err => reject(err))
  });
};

const updateLoginDate = user => {
  User.findOneAndUpdate({username: user}, {lastLogin: Date.now()}, {upsert: true}, err => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  User: User,
  addUser: addUser,
  updateLoginDate: updateLoginDate
};


