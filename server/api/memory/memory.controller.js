'use strict';

export function index(req, res) {
  var memory = {
    free: '493M',
    total: '927M',
    percent: 53
  };
  res.status(200).json(memory);
}
