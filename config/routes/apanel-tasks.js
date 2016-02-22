var express = require('express');
var Settings = require('../models/settings').Settings;
var Page = require('../models/pages');
var Media = require('../models/media');
var Post = require('../models/posts');
var upload = require('../helpers/file-handler');
var router = express.Router();

const checkAuth = function(req,res,next) {
    if (req.isAuthenticated()){
        next();
    } else res.status(401).end('Not authorized');
};

router.all('*', checkAuth);


/* ##########
 SITE WIDE ROUTES
 ########## */


router.get('/siteStatus', (req, res) => {
    Settings.findOne().lean().exec((err, data) => {
            if (!err) {
            res.json(data);

        } else {
            res.end(err);
        }
    });
});

router.post('/siteStatus', (req, res) => {
    Settings.findOneAndUpdate({siteActive: !req.body.siteActive}, {siteActive: req.body.siteActive}, (err, suc) => {
        res.json(suc);
    });
});

/* ##########
 PAGES / POSTS / MEDIA
 ROUTES
 ########## */

router.post('/:type/:action', upload.array('media'), (req, res) => {


    if (req.params.type  === 'pages' || req.params.type  ===  'posts') {
        var type = (req.params.type  === 'pages') ? Page : Post;

        switch (req.params.action) {
            case 'add':
                type.add(req).then(response => res.json(response));
                break;
            case 'edit':
                type.edit(req).then(response => res.json(response));
                break;
            case 'remove':
                type.remove(req).then(response => res.json(response));
                break;
            case 'changeStatus':
                type.chengeStatus(req).then(response =>res.json(response));
                break;
            default:
                res.end('Wrong query');
        }

    } else if (req.params.type === 'media'){

        switch (req.params.action) {
            case 'add':
                var promises =[];
                req.files.forEach(file => {
                    promises.push(Media.saveMediaReference(file, req));
                });

                Promise.all(promises).then(response => res.json(response));

                break;
            case 'remove':
                Media.removeMedia(req)
                    .then(response => res.json(response))
                    .catch(err => res.json(err));
                break;
            default:
                res.end('Wrong query');
        }
    } else {
        res.end('Wrong query')
    }
});

exports.router = router;