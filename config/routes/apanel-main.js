var passport = require('passport');
var initCheck = require('../helpers/init');
var addUser = require('../models/user').addUser;
var updateLoginDate = require('../models/user').updateLoginDate;
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
        updateLoginDate(req.user.username);
        res.redirect('/aPanel/');
    }
);

router.get('/sessionCheck', function(req,res) {
   if (req.user) {
       res.json({auth: true});
   } else res.json({auth:false});
});

router.get('/', function(req, res){
    res.render('index.jade', {auth: req.user, error: req.flash('error')});
});

exports.router = router;
