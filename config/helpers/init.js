const User = require("../models/user").User;

module.exports = (req, res, next) => {
  User.findOne({}, (err, data) => {
    if (!err && !data) {
      next();
    } else {
      res.status(404).render('404.jade');
    }
  });
};
