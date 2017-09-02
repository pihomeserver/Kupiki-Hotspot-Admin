'use strict';

export function index(req, res) {
  var information = {
    hostname: 'pihotspot',
    kernel: 'k1',
    p1: 'p1',
    p2: 'p2'
  };
  res.status(200).json(information);
}
