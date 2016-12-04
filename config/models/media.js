const mongoose = require('mongoose');
const fs = require('fs');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const mediaSchema = mongoose.Schema({
  originalname: String,
  destination: String,
  filename: String,
  path: String,
  relativePath: String,
  uploaded: Date,
  uploadedBy: String,
  category: [String],
  isActive: Boolean
});


const Media = mongoose.model('Media', mediaSchema);

const saveMediaReference = (file, req) => {
  return new Promise((resolve, reject) => {
    
    const requestSchema = Joi.object({
      originalname: Joi.string().required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      relativePath: Joi.string().required(),
      uploaded: Joi.date().required(),
      uploadedBy: Joi.string().required(),
      category: Joi.array().items(Joi.string()).required(),
      isActive: Joi.boolean().required()
    });
    
    const newMediaEntry = {
      originalname: file.originalname,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      relativePath: file.path.match(/[^public][^dist/].+/g).join(),
      uploaded: Date.now(),
      uploadedBy: req.user.username,
      category: req.body.category ? req.body.category.replace(/,/g, " ").split(' ') : [],
      isActive: true
    };
    
    requestSchema.validate(newMediaEntry, err => {
      if (err) {
        reject(err)
      } else {
        const newMedia = new Media(newMediaEntry);
        newMedia.save((error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data);
          }
        });
      }
    });
  });
};


const editMedia = req => {
  return new Promise((resolve, reject) => {
    const requestSchema = Joi.object({
      originalname: Joi.string().required(),
      category: Joi.array().items(Joi.string()).required()
    });
    const updateMedia = {
      originalname: req.body.originalname,
      category: req.body.category
    };
    
    
    requestSchema.validate(updateMedia, error => {
      if (error) {
        reject(error);
      } else {
        Media.findOneAndUpdate({_id: req.body.id}, updateMedia, {new: true}, (err, model) => {
          if (!err) {
            resolve(model);
          } else {
            reject(err);
          }
        });
      }
    });
  });
};

const chengeStatus = req => {
  return new Promise(function (resolve, reject) {
    Joi.validate({id: req.body.id, isActive: req.body.isActive},
      {
        id: Joi.objectId().required(),
        isActive: Joi.boolean().required()
      }, error => {
        if (error) {
          reject(error);
        } else {
          Media.findOneAndUpdate({_id: req.body.id}, {isActive: req.body.isActive}, err => {
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

const removeMedia = req => {
  const removeFile = (path) => {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      });
    });
  };
  
  return new Promise(function (resolve, reject) {
    Joi.validate({id: req.body.id}, {id: Joi.objectId().required()}, error => {
      if (error) {
        reject(error);
      } else {
        Media.findOneAndRemove({_id: req.body.id}, (err, data) => {
          if (err) {
            reject(err);
          } else {
            removeFile(data.path)
              .then(() => resolve())
              .catch(err => console.log(err));
          }
        });
      }
    });
  });
};

const getMedia = () => {
  return new Promise(function (resolve, reject) {
    const responseSchema = Joi.array().items(Joi.object({
      _id: Joi.objectId().required(),
      originalname: Joi.string().required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required().strip(),
      relativePath: Joi.string().required(),
      uploaded: Joi.date().required(),
      uploadedBy: Joi.string().required(),
      category: Joi.array().items(Joi.string()).required(),
      isActive: Joi.boolean().required(),
      __v: Joi.number().strip()
    }));
    
    
    Media.find().exec((err, data) => {
      if (err) {
        reject(err);
      } else {
        const payload = JSON.stringify(data);
        responseSchema.validate(payload, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
        
      }
    });
  });
};

const getCategory = (category) => {
  return new Promise(function (resolve, reject) {
    const responseSchema = Joi.array().items(Joi.object({
      _id: Joi.objectId().required(),
      originalname: Joi.string().required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required().strip(),
      relativePath: Joi.string().required(),
      uploaded: Joi.date().required(),
      uploadedBy: Joi.string().required(),
      category: Joi.array().items(Joi.string().valid(category).required()).required(),
      isActive: Joi.boolean().required(),
      __v: Joi.number().strip()
    }));
    
    
    Media.find({category}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const payload = JSON.stringify(data);
        responseSchema.validate(payload, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
        
      }
    });
  });
};

module.exports = {
  Media,
  editMedia,
  saveMediaReference,
  chengeStatus,
  removeMedia,
  getMedia,
  getCategory
};


