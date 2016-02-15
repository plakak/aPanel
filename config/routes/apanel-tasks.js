var addUser = require('../models/user').addUser;
var express = require('express');

const checkAuth = function(req,res,next) {
    if (req.isAuthenticated()){
        next();
    } else res.status(401).end('Not authorized');
};


var router = express.Router();

router.all('*', checkAuth);

router.get('getData/:type?/:id?', (req,res) => {
    res.end('authWorks')
});


exports.router = router;