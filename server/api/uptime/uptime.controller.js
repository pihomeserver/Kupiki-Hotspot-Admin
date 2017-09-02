'use strict';

export function index(req, res) {
  var uptime = {
    days: '3',
    unit: 'days'
  };
  res.status(200).json(uptime);
}
