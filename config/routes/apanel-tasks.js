var express = require('express');
var Settings = require('../models/settings');
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


router.get('/siteStatus', (req, res, next) => {
    Settings.getSiteStatus()
        .then(data => res.json(data))
        .catch(err => next(err))
});

router.post('/siteStatus', (req, res, next) => {
    Settings.changeSiteStatus(req)
        .then(data => res.json(data))
        .catch(error => next(error));
});


/* ##########
 PAGES / POSTS / MEDIA
 ROUTES
 ########## */

router.post('/:type/:action', upload.array('media'), (req, res, next) => {


    if (req.params.type  === 'pages' || req.params.type  ===  'posts') {
        var type = (req.params.type  === 'pages') ? Page : Post;

        switch (req.params.action) {
            case 'add':
                type.add(req)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'edit':
                type.edit(req)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'remove':
                type.remove(req)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'changeStatus':
                type.chengeStatus(req)
                    .then(response =>res.json(response))
                    .catch(error => next(error));
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

                Promise.all(promises)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'edit':
                Media.editMedia(req)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'remove':
                Media.removeMedia(req)
                    .then(response => res.json(response))
                    .catch(error => next(error));
                break;
            case 'addCategory':
                Settings.addCategory(req)
                    .then(resposne => res.json(resposne))
                    .catch(error => next(error));
                break;
            case 'removeCategory':
                Settings.removeCategory(req)
                    .then(resposne => res.json(resposne))
                    .catch(error => next(error));
                break;
            default:
                res.end('Wrong query');
        }
    } else {
        res.end('Wrong query')
    }
});

exports.router = router;