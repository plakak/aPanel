var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var year = moment().format('YYYY');
        var month = moment().format('MM');

        const DIR = `public/dist/uploads/${year}/${month}`;

        fs.stat(DIR, err => {
            if (err) {
                mkdirp(DIR, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        cb(null, DIR)
                    }
                });
            } else {
                cb(null, DIR);
            }
        });
    },

    filename: function (req, file, cb) {

        var getFileExt = function(fileName){
            var fileExt = fileName.split(".");
            if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
                return "";
            }
            return fileExt.pop();
        };

        cb(null, Date.now() + '.' + getFileExt(file.originalname))
    }
});

//TODO: Limits

module.exports = multer({storage});