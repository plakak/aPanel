const passport = require('passport');
const initCheck = require('../helpers/init');
const addUser = require('../models/user').addUser;
const updateLoginDate = require('../models/user').updateLoginDate;
const express = require('express');
const router = express.Router();


router.get('/init', initCheck, (req, res) => {
  res.render('init.jade', {authorized: true});
});

router.post('/init', initCheck, (req, res) => {
  addUser(req)
    .then(data => {
      if (data) {
        res.redirect('/aPanel/');
      }
    })
    .catch(() => res.render('init.jade', {authorized: true, error: true}));
});

router.get('/expired', (req, res) => {
  res.render('index.jade', {auth: req.user, expired: true});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/aPanel/');
});

router.post('/login', passport.authenticate('local',
  {
    failureRedirect: '/aPanel/',
    failureFlash: true,
    badRequestMessage: 'Username and password are required to login.'
  }), (req, res) => {
    updateLoginDate(req.user.username);
    res.redirect('/aPanel/');
  }
);

router.get('/sessionCheck', (req, res) => {
  if (req.user) {
    res.json({auth: true});
  } else res.json({auth: false});
});

router.get('/', (req, res) => {
  res.render('index.jade', {auth: req.user, error: req.flash('error')});
});

exports.router = router;
