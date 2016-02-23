var mongoose = require('mongoose');
var Settings = require('../models/settings').Settings;
var fs = require('fs');


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

        var newMediaEntry = {
            originalname: file.originalname,
            destination: file.destination,
            filename: file.filename,
            path: file.path,
            relativePath: file.path.match(/[^public][^dist/].+/g),
            uploaded: Date.now(),
            uploadedBy: req.user.username,
            category: req.body.category ? req.body.category.replace(/\W+/g, " ").split(' ') : '',
            isActive: true
        };

        var newMedia = new Media(newMediaEntry);

        newMedia.save((error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
};


const editMedia = (req) => {
    return new Promise((resolve, reject) => {
        var updateMedia;

        if (req.body.originalname) {
            updateMedia = {
                originalname: req.body.originalname,
                category: req.body.category ? req.body.category.replace(/\W+/g, " ").split(' ') : ''
            };
        } else {
            updateMedia = {category: req.body.category};
        }

        Media.findOneAndUpdate({_id: req.body.id}, updateMedia, {new : true}, (err, model) => {
            if (!err) {
                resolve(model);
            } else {
                reject(err);
            }
        });
    });
};

//todo: move categories into settings model

const addCategory = req => {
    return new Promise(function (resolve, reject) {

        var category = req.body.category;

        Settings.findOneAndUpdate({},{$push: {"categories": category}}, {safe: true, new : true}, (err, model) => {

            if (!err) {
                resolve(model);
            } else {
                reject(err);
            }
        });
    });
};

const removeCategory = req => {
    return new Promise(function (resolve, reject) {

        Settings.findOne((err, data) => {

            var index = data.categories.indexOf(req.body.category);
            var newData = data.categories.slice(0, index).concat(data.categories.slice(index +1));

        data.update(newData)
            .then(resolve())
            .catch(reject(err => console.log(err)));

        });
    });
};


const chengeStatus = req => {
    return new Promise(function (resolve, reject) {

        Media.findOneAndUpdate({_id: req.body.id }, {isActive: req.body.isActive}, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const changeFileName = req => {

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
        Media.findOneAndRemove({_id: req.body.id }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                removeFile(data.path)
                .then( ()=> resolve() )
                .catch( err => console.log(err) );
            }
        });
    });
};

const getMedia = () => {
    return new Promise(function (resolve, reject) {
        Media.find().exec((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const getCategory = (category) => {
    return new Promise(function (resolve, reject) {
        Media.find({category}, (err, data) => {
            if(!err) {
                resolve(data)
            }
            else reject(err);
        });
    });
};

module.exports = {
    Media,
    editMedia,
    saveMediaReference,
    addCategory,
    removeCategory,
    chengeStatus,
    removeMedia,
    changeFileName,
    getMedia,
    getCategory
};


