var passport = require('passport');
var initCheck = require('./helpers/init');
var addUser = require('./models/user').addUser;


const checkAuth = function(req,res,next) {
    if (req.isAuthenticated()){
        next();
    } else res.status(401).end('Not authorized');
};


module.exports = function(app, express) {

    var router = express.Router();

    app.use('/', router);

    router.all('/tasks/*', checkAuth);

    router.get('/', function(req, res){
        res.render('index.jade', {auth: req.user, error: req.flash('error')});
    });

    router.get('/init', initCheck, function(req, res){
        res.render('init.jade', {authorized: true});
    });

    router.post('/init', initCheck, function(req, res) {
        addUser(req, function(err, success){
            if (!err && success) {
                res.redirect('/');
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
        res.redirect('/');
    });

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true,
        badRequestMessage: 'Username and password are required to login.'
    }), function(req, res){
        res.redirect('/');
    });

    // AUTH

    router.get('/tasks/getPosts', function(req,res){
        res.end('authWorks')
    });
};