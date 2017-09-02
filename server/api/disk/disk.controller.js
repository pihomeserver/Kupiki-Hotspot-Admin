'use strict';

export function index(req, res) {
  var disk = {
    free: '1.9G',
    total: '7.2G',
    percent: 27
  };
  res.status(200).json(disk);
}
