var passport = require('passport');
var initCheck = require('../helpers/init');
var addUser = require('../models/user').addUser;
var express = require('express');

var router = express.Router();


router.get('/init', initCheck, function(req, res){
    res.render('init.jade', {authorized: true});
});

router.post('/init', initCheck, function(req, res) {
    addUser(req, function(err, success){
        if (!err && success) {
            res.redirect('/aPanel/');
        } else {
            res.render('init.jade', {authorized: true, error: true});
        }
    });
});

router.get('/expired', function(req, res){
    res.render('index.jade', {auth: req.user, expired: true});
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/aPanel/');
});

router.post('/login', passport.authenticate('local',
    {
        failureRedirect: '/aPanel/',
        failureFlash: true,
        badRequestMessage: 'Username and password are required to login.'
    }
), function(req, res){
        res.redirect('/aPanel/');
    }
);

router.get('/', function(req, res){
    res.render('index.jade', {auth: req.user, error: req.flash('error')});
});

exports.router = router;
