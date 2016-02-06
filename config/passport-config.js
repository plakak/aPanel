var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("./models/user").User;

//1800000

module.exports = function(app) {
    app.use(session({secret: process.env.SECRET, cookie: {maxAge: 999900000}, resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    return done(err);
                } else {
                    user.validPassword(password, function(err) {
                        if (err) {
                            return done(null, false, {message: 'Wrong username or password.'});
                        } else return done(null, user);
                    });
                }
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        var sessionUser = {_id: user._id, username: user.username};
        done(null, sessionUser);
    });

    passport.deserializeUser(function (sessionUser, done) {
        done(null, sessionUser);
    });
};