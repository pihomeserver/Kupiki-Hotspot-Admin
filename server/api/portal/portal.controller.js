'use strict';

const execPromise = require('child-process-promise').exec;
const shared = require('../../config/environment/shared');

import multer from 'multer';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/assets/upload/');
  },
  filename: function (req, file, cb) {
    cb(null, 'background.jpg');
  }
});

export function restoreBackground(req, res) {
  execPromise('cp ./client/assets/upload/default.jpg ./client/assets/upload/background.jpg', { timeout : shared.httpSudoTimeout })
    .then(function (result) {
      res.status(200).json({status: 'success', result: {code: 0, message: '' }});
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}

export function uploadBackground(req, res) {
  var upload = multer({
    storage: storage,
    rename: function (fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function () {
        console.log("Upload is starting...");
    },
    onFileUploadComplete: function () {
        console.log("File uploaded");
    }
  });
  upload.single('file')(req, res, function (err) {
    if (err) {
      return res.status(200).json({status: 'failed', result: {code: -1, message: err }});
    }
    res.status(200).json({status: 'success', result: {code: 0, message: '' }});
  });
}
