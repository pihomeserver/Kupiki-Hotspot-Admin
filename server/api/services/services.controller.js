'use strict';

const execPromise = require('child-process-promise').exec;

export function index(req, res) {
  execPromise('sudo /usr/sbin/service --status-all', { timeout : 20000 })
    .then(function (result) {
      var services = [];
      result.stdout.split('\n').forEach(function(elt) {
        if (elt.trim().length > 0) {
          var arrTmp = elt.trim().split(/[\s\t]+/);
          services.push({
            name: arrTmp[3],
            status: (arrTmp[1] === '+' ? true : false)
          });
        }
      });
      if (services.length === 0) {
        res.status(200).json({status: 'failed', result: {code: -1, message: 'No services found' }});
      } else {
        res.status(200).json({status: 'success', result: {code: 0, message: services }});
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}

export function switchService(req, res) {
  if (req.body) {
    if (req.body.service) {
      let command = 'sudo /usr/sbin/service '+req.body.service;
      (req.body.status)?command += ' start':command += ' stop';
      execPromise(command, { timeout : 20000 })
        .then(function (result) {
          res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
        })
        .catch(function (error) {
          res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
        })
    } else {
      res.status(200).json({ status: 'failed', result: { code : -1, message : 'Switch service - Unable to detect service' }});
    }
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Switch service - Unable to get parameters' }});
  }
}
