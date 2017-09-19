'use strict';

const execPromise = require('child-process-promise').exec;

export function index(req, res) {

  execPromise('sudo /usr/sbin/service --status-all')
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
      })
      if (services.length === 0) {
        res.status(200).json({status: 'failed', result: {code: -1, message: 'No services found' }});
      } else {
        res.status(200).json({status: 'success', result: {code: 0, message: services }});
      }
    })
    .catch(function (error) {
      console.log(error)
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}
