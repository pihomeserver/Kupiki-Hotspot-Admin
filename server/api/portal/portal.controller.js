'use strict';

import * as script from '../../system/system.service';

import multer from 'multer';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/assets/upload/');
  },
  filename: function (req, file, cb) {
    cb(null, 'background.jpg');
  }
});

export function saveConfiguration(req, res) {
  if (req.body.configuration) {
    let configuration = req.body.configuration;
    let fs = require('fs');
    fs.unlink('/tmp/portal.conf', function (error) {
      if (error && error.code !== 'ENOENT') {
        console.log(error);
        res.status(200).json({status: 'failed', result: {code: error.errno, message: error }});
      } else {
        var stream = fs.createWriteStream('/tmp/portal.conf');
        stream.once('open', function(fd) {
          stream.write(JSON.stringify(configuration, null, 4));
          stream.end();
        });
        stream.on('error', function(err) {
          console.log(err)
          res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the portal configuration file' }});
        });
        stream.on('close', function(err) {
          script.execPromise('portal saveConfiguration')
            .then(function(result) {
              res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
            })
            .catch(function(error) {
              console.log(error);
              res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the portal configuration file' }});
            });
        });
      }
    });
  } else {
    res.status(200).json({status: 'failed', result: {code: -1, message: 'No portal configuration found in the request' }});
  }
}

export function getConfiguration(req, res) {
  script.execPromise('portal getConfiguration')
    .then(function (result) {
      res.status(200).json({status: 'success', result: {code: 0, message: result.stdout }});
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}

export function restoreBackground(req, res) {
  script.execPromise('background default')
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
