const express = require('express');
const Page = require('../models/pages');
const Media = require('../models/media');
const Post = require('../models/posts');
const router = express.Router();


router.get('/getData/:type/:category?', (req, res, next) => {
  if (!req.params.type) {
    res.status(404).end('No such type');
  } else {
    
    switch (req.params.type) {
      case 'pages':
        Page.getPages({isActive: true})
          .then(data => res.json(data))
          .catch(error => next(error));
        break;
      case 'posts':
        Post.getPosts({isActive: true})
          .then(data => res.json(data))
          .catch(error => next(error));
        break;
      case 'media':
        if (!req.params.category) {
          Media.getMedia()
            .then(data => res.json(data))
            .catch(error => next(error));
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
