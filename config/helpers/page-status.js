var Settings = require('../models/settings').Settings;

module.exports =  (req, res, next) => {
    Settings.find({}, (err, data) => {

        if (!err) {
            var setting = data[0];

            if (!setting.siteActive) {

                res.render('offline.jade', {message: setting.offlineDescription, pageTitle: setting.siteName});

            } else {

                next();
            }

        } else {
            res.end('Oops! Something went wrong. Please contact administrator.')
        }
    });
};