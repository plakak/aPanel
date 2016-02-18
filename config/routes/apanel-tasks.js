var express = require('express');

var Settings = require('../models/settings').Settings;
var Page = require('../models/pages');

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

router.post('/getData/siteStatus', (req, res) => {
    Settings.findOneAndUpdate({siteActive: !req.body.siteActive}, {siteActive: req.body.siteActive}, (err, suc) => {
        res.json(suc);
    });
});


router.post('/getData/:type/:action', (req, res) => {
    if (req.params.type === 'pages') {
        switch(req.params.action) {
            case 'add': Page.addPage(req).then(response => res.json(response));
                break;
            case 'edit': Page.editPage(req).then(response => res.json(response));
                break;
            case 'remove': Page.removePage(req).then(response => res.json(response));
                break;
            default: res.end('Wrong query');
        }
    } else {
        res.end('Wrong query')
    }
});

router.get('/getData/:type?/:id?', (req,res) => {

    if(!req.params.type){
        res.status(404).end('No such type');
    } else {

        switch(req.params.type) {
            case 'pages':
                Page.returnPages()
                    .then(data => res.json(data))
                    .catch(err => console.log(err));
                break;
            default:
                res.status(404).end('No such type');
                break;
        }
    }
});


exports.router = router;