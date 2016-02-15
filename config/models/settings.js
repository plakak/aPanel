var mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    siteName: String,
    siteActive: Boolean,
    offlineDescription: String,
    lastLogin: Date
});

const Settings = mongoose.model('Settings', settingsSchema);


module.exports = {
    Settings
};

