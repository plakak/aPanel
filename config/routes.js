var passport = require('passport');


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
        res.render('index.jade', {auth: req.user});
    });

    router.get('/expired', function(req, res){
        res.render('index.jade', {auth: req.user, expired: true});
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.post('/login', passport.authenticate('local'), function(req, res){
        res.redirect('/');
    });

    // AUTH

    router.get('/tasks/getPosts', function(req,res){
        res.end('authWorks')
    });
};