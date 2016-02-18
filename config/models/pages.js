var mongoose = require('mongoose');
var bcrypt = require('../helpers/bcrypt');

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

        var newPageData = {
            title: req.body.title,
            content: req.body.content,
            datePublished: Date.now(),
            dateEdited: Date.now(),
            by: req.body.by,
            isActive: false
        };

        var newPage = new Page(newPageData);

        newPage.save((error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
};

const editPage = req => {
    return new Promise(function (resolve, reject) {

        var updateData = {
            title: req.body.title,
            dateEdited: Date.now(),
            content: req.body.content
        };

        Page.findOneAndUpdate({_id: req.body.id}, updateData, {new: true}, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
};

const changeStatus = req => {
    Page.findOneAndUpdate({title: req.body.title, datePublished: req.body.datePublished }, {isActive: req.body.isActive}, err => {
        return new Promise(function (resolve, reject) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const removePage = req => {
    return new Promise(function (resolve, reject) {
        Page.findOneAndRemove({_id: req.body.id }, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const returnPages = () => {
    return new Promise(function (resolve, reject) {
        Page.find().exec((err, data) => {
           if (err) {
               reject(err);
           } else {
               resolve(data);
           }
        });
    });
};

const returnPage = title => {
    return new Promise(function (resolve, reject) {
        Page.findOne({title: title}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    Page,
    addPage,
    editPage,
    changeStatus,
    removePage,
    returnPages,
    returnPage
};


