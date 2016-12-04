const express = require('express');
const Settings = require('../models/settings');
const Page = require('../models/pages');
const Media = require('../models/media');
const Post = require('../models/posts');
const upload = require('../helpers/file-handler');
const router = express.Router();

const checkAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
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
  
  if (req.params.type === 'pages' || req.params.type === 'posts') {
    const type = (req.params.type === 'pages') ? Page : Post;
    
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
          .then(response => res.json(response))
          .catch(error => next(error));
        break;
      default:
        res.end('Wrong query');
    }
    
  } else if (req.params.type === 'media') {
    
    switch (req.params.action) {
      case 'add':
        const promises = [];
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

router.get('/getData/:type/:category?', (req, res, next) => {
  if (!req.params.type) {
    res.status(404).end('No such type');
  } else {
    switch (req.params.type) {
      case 'pages':
        Page.getPages()
          .then(data => res.json(data))
          .catch(error => next(error));
        break;
      case 'posts':
        Post.getPosts()
          .then(data => res.json(data))
          .catch(error => next(error));
        break;
      case 'media':
        if (!req.params.category) {
          Media.getMedia()
            .then(data => res.json(data))
            .catch(error => next(error))
        } else {
          Media.getCategory(req.params.category)
            .then(data => res.json(data))
            .catch(error => next(error));
        }
        break;
      default:
        res.status(404).end('No such type');
        break;
    }
  }
});


exports.router = router;
