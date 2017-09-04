'use strict';

const os = require('os');

export function index(req, res) {
  var information = {
    'Architecture' : os.arch(),
    'CPU' : os.cpus().length,
    'Hostname' : os.hostname(),
    'OS Type' : os.type(),
    'Plateform' : os.platform(),
    'Release' : os.release()
  };
  res.status(200).json(information);
}
