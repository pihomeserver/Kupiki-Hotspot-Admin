'use strict';

export function index(req, res) {
  var cpu = {
    instant: 1.3,
    idle: 98.7,
    percent: 1.3
  };
  res.status(200).json(cpu);
}
