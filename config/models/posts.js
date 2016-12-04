const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

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
    
    const requestSchema = Joi.object({
      title: Joi.string().required(),
      datePublished: Joi.date().required(),
      dateEdited: Joi.date().required(),
      content: Joi.string().required(),
      by: Joi.string().required(),
      isActive: Joi.boolean().required(),
      attachedImages: Joi.array().items(Joi.objectId()).required()
    });
    
    const newPostData = {
      title: req.body.title,
      content: req.body.content,
      datePublished: Date.now(),
      dateEdited: Date.now(),
      by: req.body.by,
      isActive: false,
      attachedImages: req.body.attachedImages ? req.body.attachedImages : []
    };
    
    requestSchema.validate(newPostData, error => {
      if (error) {
        reject(error);
      } else {
        const newPost = new Post(newPostData);
        newPost.save(error => {
          if (error) {
            reject(error)
          } else {
            newPost.populate('attachedImages', err => {
              if (!err) {
                resolve(newPost);
              } else reject(err);
            });
          }
        });
      }
    });
  });
};


const editPost = req => {
  return new Promise((resolve, reject) => {
    
    const requestSchema = Joi.object({
      title: Joi.string().required(),
      dateEdited: Joi.date().required(),
      content: Joi.string().required(),
      attachedImages: Joi.array().items(Joi.objectId()).required()
    });
    
    const editPostData = {
      title: req.body.title,
      content: req.body.content,
      dateEdited: Date.now(),
      attachedImages: req.body.attachedImages ? req.body.attachedImages : []
    };
    
    requestSchema.validate(editPostData, error => {
      if (error) {
        reject(error);
      } else {
        Post.findOneAndUpdate({_id: req.body.id}, editPostData, {new: true}).populate('attachedImages').exec((err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        });
      }
    });
  });
};


const getPosts = confObject => {
  return new Promise(function (resolve, reject) {
    
    const responseSchema = Joi.array().items(Joi.object().keys({
      _id: Joi.objectId(),
      __v: Joi.number().strip(),
      title: Joi.string().required(),
      datePublished: Joi.date().required(),
      dateEdited: Joi.date().required(),
      content: Joi.string().required(),
      by: Joi.string().required(),
      isActive: Joi.boolean().required(),
      attachedImages: Joi.array().items(Joi.object()).required()
    }));
    
    Post.find(confObject)
      .populate('attachedImages')
      .exec(function (error, posts) {
        if (!error) {
          const payload = JSON.stringify(posts);
          
          responseSchema.validate(payload, (err, sanitized) => {
            if (!err) {
              resolve(sanitized);
            } else {
              reject(err);
            }
          });
          
        } else {
          reject(error)
        }
      })
  });
};

const removePost = req => {
  return new Promise(function (resolve, reject) {
    
    const requestSchema = Joi.object({
      _id: Joi.string().required()
    });
    
    requestSchema.validate({_id: req.body.id}, error => {
      if (error) {
        reject(error);
      } else {
        Post.findOneAndRemove({_id: req.body.id}, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

const chengeStatus = req => {
  return new Promise(function (resolve, reject) {
    
    const requestSchema = Joi.object({
      _id: Joi.string().required(),
      isActive: Joi.boolean().required()
    });
    
    requestSchema.validate({_id: req.body.id, isActive: req.body.isActive}, error => {
      if (error) {
        reject(error);
      } else {
        Post.findOneAndUpdate({_id: req.body.id}, {isActive: req.body.isActive}, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

module.exports = {
  Post,
  add: addPost,
  edit: editPost,
  remove: removePost,
  getPosts,
  chengeStatus
};


