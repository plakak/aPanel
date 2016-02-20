var mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    datePublished: {type: Date, default: Date.now()},
    dateEdited: {type: Date, default: Date.now()},
    content: String,
    by: String,
    isActive: Boolean,
    attachedImages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }]
});

const Post = mongoose.model('Posts', postSchema);

const addPost = req => {
    return new Promise((resolve, reject) => {

        var newPostData = {
            title: req.body.title,
            content: req.body.content,
            datePublished: Date.now(),
            dateEdited: Date.now(),
            by: req.body.by,
            isActive: false,
            attachedImages: [req.body.media_ids]
        };

        var newPost = new Post(newPostData);

        newPost.save((error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
};


const getPosts = () => {
    return new Promise(function (resolve, reject) {
        Post.find({})
            .populate('attachedImages')
            .exec(function(error, posts) {
                if (!error) {
                    resolve(posts);
                } else {
                    reject(error)
                }
            })
    });
};

const chengeStatus = req => {
    return new Promise(function (resolve, reject) {

        Post.findOneAndUpdate({_id: req.body.id }, {isActive: req.body.isActive}, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    Post,
    addPost,
    getPosts,
    chengeStatus
};

