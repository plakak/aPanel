var mongoose = require('mongoose');

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


module.exports = {
    Settings
};

