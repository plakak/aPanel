const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    const year = moment().format('YYYY');
    const month = moment().format('MM');
    
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
    
    const getFileExt = function (fileName) {
      const fileExt = fileName.split(".");
      if (fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 )) {
        return "";
      }
      return fileExt.pop();
    };
    
    cb(null, Date.now() + '.' + getFileExt(file.originalname))
  }
});

const limits = {fileSize: 1024 * 1024 * 10};

module.exports = multer({storage, limits});
