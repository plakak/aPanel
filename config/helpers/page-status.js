const Settings = require('../models/settings').Settings;

module.exports = (req, res, next) => {
  Settings.find({}, (err, data) => {
    if (!err) {
      const setting = data[0];
      if (!setting.siteActive && !req.path.match(/\/aPanel\/?.+/) && !req.user) {
        res.render('offline.jade', {message: setting.offlineDescription, pageTitle: setting.siteName});
      } else {
        next();
      }
    } else {
      res.end('Oops! Something went wrong. Please contact administrator.')
    }
  });
};
