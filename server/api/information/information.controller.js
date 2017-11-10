'use strict';

const os = require('os');

export function index(req, res) {
  var information = {
    'architecture' : os.arch(),
    'CPU' : os.cpus().length,
    'hostname' : os.hostname(),
    'OS Type' : os.type(),
    'plateform' : os.platform(),
    'release' : os.release()
  };
  res.status(200).json(information);
}
