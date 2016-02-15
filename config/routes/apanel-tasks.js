var express = require('express');

var Settings = require('../models/settings').Settings;

const checkAuth = function(req,res,next) {
    if (req.isAuthenticated()){
        next();
    } else res.status(401).end('Not authorized');
};


var router = express.Router();

router.all('*', checkAuth);

router.get('/getData/siteStatus', (req, res) => {
    Settings.findOne().lean().exec((err, data) => {
            if (!err) {
            res.json(data);

        } else {
            res.end(err);
        }
    });
});

router.get('/getData/:type?/:id?', (req,res) => {
    res.end('authWorks')
});


exports.router = router;