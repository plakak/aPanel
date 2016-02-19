var express = require('express');
var Page = require('../models/pages');
var Media = require('../models/media');
var Post = require('../models/posts');
var router = express.Router();


router.get('/getData/:type?/', (req,res) => {
    if(!req.params.type){
        res.status(404).end('No such type');
    } else {

        switch(req.params.type) {
            case 'pages':
                Page.getPages()
                    .then(data => res.json(data))
                    .catch(err => console.log(err));
                break;
            case 'posts':
                Post.getPosts()
                    .then(data => res.json(data))
                    .catch(err => console.log(err));
                break;
            case 'media':
                Media.getMedia()
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
