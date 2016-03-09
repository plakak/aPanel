var mongoose = require('mongoose');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageSchema = mongoose.Schema({
    title: String,
    datePublished: {type: Date, default: Date.now()},
    dateEdited: {type: Date, default: Date.now()},
    content: String,
    by: String,
    isActive: Boolean
});

const Page = mongoose.model('Pages', pageSchema);

const addPage = req => {
    return new Promise((resolve, reject) => {

        const requestSchema = Joi.object({
            title: Joi.string().required(),
            datePublished: Joi.date().required(),
            dateEdited: Joi.date().required(),
            content: Joi.string().required(),
            by: Joi.string().required(),
            isActive: Joi.boolean().required(),
            attachedImages: Joi.any().forbidden()
        });

        var newPageData = {
            title: req.body.title,
            content: req.body.content,
            datePublished: Date.now(),
            dateEdited: Date.now(),
            by: req.body.by,
            isActive: false
        };

        requestSchema.validate(newPageData, error => {
            if (error) {
                reject(error);
            } else {

                var newPage = new Page(newPageData);

                newPage.save((error, data) => {
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

const editPage = req => {
    return new Promise(function (resolve, reject) {

        const requestSchema = Joi.object({
            title: Joi.string().required(),
            dateEdited: Joi.date().required(),
            content: Joi.string().required()
        });

        var updateData = {
            title: req.body.title,
            dateEdited: Date.now(),
            content: req.body.content
        };

        requestSchema.validate(updateData, error => {
            if (error) {
                reject(error);
            } else {
                Page.findOneAndUpdate({_id: req.body.id}, updateData, {new: true}, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    })
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
                Page.findOneAndUpdate({_id: req.body.id}, {isActive: req.body.isActive}, err => {
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

const removePage = req => {
    return new Promise(function (resolve, reject) {

        const requestSchema = Joi.object({
            _id: Joi.string().required()
        });
        requestSchema.validate({_id: req.body.id}, error => {
            if (error) {
                reject(error);
            } else {
                Page.findOneAndRemove({_id: req.body.id}, err => {
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

const getPages = confObject => {
    return new Promise(function (resolve, reject) {

        const responseSchema = Joi.array().items(Joi.object().keys({
            _id: Joi.objectId(),
            __v: Joi.number().strip(),
            title: Joi.string().required(),
            datePublished: Joi.date().required(),
            dateEdited: Joi.date().required(),
            content: Joi.string().required(),
            by: Joi.string().required(),
            isActive: Joi.boolean().required()
        }));

        Page.find(confObject).exec((err, data) => {
           if (err) {
               reject(err);
           } else {

               var payload = JSON.stringify(data);

               responseSchema.validate(payload, (error, sanitized) => {
                   if (error) {
                       reject(error);
                   } else {
                       resolve(sanitized);
                   }
               });

           }
        });
    });
};


module.exports = {
    Page,
    add: addPage,
    edit: editPage,
    chengeStatus,
    remove: removePage,
    getPages
};


