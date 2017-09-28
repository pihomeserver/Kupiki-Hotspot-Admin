'use strict';

const execPromise = require('child-process-promise').exec;
const shared = require('../../config/environment/shared');

export function setConfiguration(req, res) {
  res.status(200).json({status: 'success', result: {code: 0, message: '' }});
}

export function getConfiguration(req, res) {
  execPromise('cat /etc/hostapd/hostapd.conf', { timeout : shared.httpSudoTimeout })
    .then(function (result) {
      // console.log(result)
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
