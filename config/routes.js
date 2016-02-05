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

    router.all('/aPanel/tasks/*', checkAuth);

    router.get('/aPanel', function(req, res){
        res.render('index.jade', {auth: req.user, error: req.flash('error')});
    });

    router.get('/aPanel/init', initCheck, function(req, res){
        res.render('init.jade', {authorized: true});
    });

    router.post('/aPanel/init', initCheck, function(req, res) {
        addUser(req, function(err, success){
            if (!err && success) {
                res.redirect('/aPanel/');
            } else {
                res.render('init.jade', {authorized: true, error: true});
            }
        });

    });

    router.get('/aPanel/expired', function(req, res){
        res.render('index.jade', {auth: req.user, expired: true});
    });

    router.get('/aPanel/logout', function(req, res){
        req.logout();
        res.redirect('/aPanel/');
    });

    router.post('/aPanel/login', passport.authenticate('local', {
        failureRedirect: '/aPanel/',
        failureFlash: true,
        badRequestMessage: 'Username and password are required to login.'
    }), function(req, res){
        res.redirect('/aPanel/');
    });

    // AUTH

    router.get('/aPanel/tasks/getPosts', function(req,res){
        res.end('authWorks')
    });
};