'use strict';

const execPromise = require('child-process-promise').exec;
const shared = require('../../config/environment/shared');

export function setConfiguration(req, res) {
  console.log(req.body);
  if (req.body.configuration) {
    let fields = req.body.configuration;
    let fs = require('fs');
    fs.unlink('/tmp/hostapd.conf', function (error) {
      if (error && error.code !== 'ENOENT') {
        console.log(error);
        res.status(200).json({status: 'failed', result: {code: error.errno, message: error }});
      } else {
        var stream = fs.createWriteStream('/tmp/hostapd.conf');
        stream.once('open', function(fd) {
          for (var i = 0; i < fields.length; i++) {
            stream.write(fields[i].field+'='+fields[i].value+'\n');
          }
          stream.end();
        });
        stream.on('error', function(err) {
          res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the configuration file' }});
        });
        stream.on('close', function(err) {
          execPromise('sudo cp /tmp/hostapd.conf /etc/hostapd/hostapd.conf', { timeout : shared.httpSudoTimeout })
            .then(function(result) {
              if (req.body.restart) {
                execPromise('sudo /usr/sbin/service hostapd restart', { timeout : shared.httpSudoTimeout })
                  .then(function (result) {
                    res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
                  })
                  .catch(function (error) {
                    res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
                  });
                } else {
                  res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
                }
            })
            .catch(function(error) {
              console.log(error);
              res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the configuration file' }});
            });
        });
      }
    });
  } else {
    res.status(200).json({status: 'failed', result: {code: -1, message: 'No configuration found in the request' }});
  }
}

export function getConfiguration(req, res) {
  execPromise('cat /etc/hostapd/hostapd.conf', { timeout : shared.httpSudoTimeout })
    .then(function (result) {
      var configuration = [];
      result.stdout.split('\n').forEach(function(elt) {
        if (elt.trim().length > 0) {
          var arrTmp = elt.trim().split(/[=]+/);
          configuration.push({
            field: arrTmp[0],
            value: arrTmp[1]
          });
        }
      });
      if (configuration.length === 0) {
        res.status(200).json({status: 'failed', result: {code: -1, message: 'No configuration found' }});
      } else {
        res.status(200).json({status: 'success', result: {code: 0, message: configuration }});
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}
