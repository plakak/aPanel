var mongoose = require('mongoose');
var Joi = require('joi');

const settingsSchema = mongoose.Schema({
    siteName: String,
    siteActive: Boolean,
    offlineDescription: String,
    categories: [String]
});

settingsSchema.methods.update = function(newArr) {
    return new Promise((resolve, reject) => {
        try {
            this.categories = newArr;
            this.save();
            resolve();
        } catch(err) {
            reject(err);
        }
    });
};

const Settings = mongoose.model('Settings', settingsSchema);

const getSiteStatus = () => {
    return new Promise((resolve, reject) => {

        const schema = Joi.object().options({allowUnknown: true}).keys({
            categories: Joi.array().items(Joi.string()).required()
        });

        Settings.findOne().lean().exec((err, data) => {
            if (!err) {
                Joi.validate(data, schema, error => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            } else {
                reject(err);
            }
        });
    });
};

const changeSiteStatus = req => {
    return new Promise((resolve, reject) => {

        const schema = {siteActive: Joi.boolean().required() };

        Joi.validate({siteActive: req.body.siteActive}, schema, err => {

            if (err) {
                reject(err);
            } else {
                Settings.findOneAndUpdate({siteActive: !req.body.siteActive}, {siteActive: req.body.siteActive}, (err, suc) => {
                    if (!err) {
                        Joi.validate({siteActive: suc.siteActive}, schema, err => {
                            if (!err) {
                                resolve(suc);
                            } else {
                                reject(err);
                            }
                        });
                    } else {
                        reject(err);
                    }
                });
            }
        });
    });
};

const addCategory = req => {
    return new Promise((resolve, reject) => {

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
    return new Promise((resolve, reject) => {

        Settings.findOne((err, data) => {

            var index = data.categories.indexOf(req.body.category);
            var newData = data.categories.slice(0, index).concat(data.categories.slice(index +1));

            data.update(newData)
                .then(resolve())
                .catch(reject(err => console.log(err)));

        });
    });
};



module.exports = {
    Settings,
    getSiteStatus,
    changeSiteStatus,
    addCategory,
    removeCategory
};

