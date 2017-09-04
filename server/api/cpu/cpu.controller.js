'use strict';

const os = require('os');

export function index(req, res) {
  var cpu = {
    '1m' : os.loadavg()[0].toFixed(1),
    '5m' : os.loadavg()[1].toFixed(1),
    '15m' : os.loadavg()[2].toFixed(1),
  };
  res.status(200).json(cpu);
}
