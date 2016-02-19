var mongoose = require('mongoose');

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

const chengeStatus = req => {
    return new Promise(function (resolve, reject) {

        Page.findOneAndUpdate({_id: req.body.id }, {isActive: req.body.isActive}, err => {
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

const getPages = () => {
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


module.exports = {
    Page,
    addPage,
    editPage,
    chengeStatus,
    removePage,
    getPages
};


