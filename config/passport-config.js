const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/user").User;

module.exports = function (app) {
  app.use(session({secret: process.env.SECRET, cookie: {maxAge: 1800000}, resave: false, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy((username, password, done) => {
      
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          done(null, false, {message: 'Wrong username or password.'})
        } else {
          user.validPassword(password)
            .then(() => done(null, user))
            .catch(err => done(null, false, {message: 'Wrong username or password.'}));
        }
      }
    });
  }));
  
  passport.serializeUser((user, done) => {
    const sessionUser = {
      _id: user._id,
      username: user.username,
      lastLogin: Date.parse(user.lastLogin)
    };
    done(null, sessionUser);
  });
  
  passport.deserializeUser((sessionUser, done) => {
    done(null, sessionUser);
  });
};
