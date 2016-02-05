var User = require("../models/user").User;

module.exports = function(req, res, next) {
  User.findOne({}, function(err, data) {
     if (!err && !data) {
         next();
     } else {
         res.end('Nice try. Go away.')
     }
  });
};