var mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    siteName: String,
    siteActive: Boolean,
    offlineDescription: String
});

const Settings = mongoose.model('Settings', settingsSchema);


module.exports = {
    Settings
};

