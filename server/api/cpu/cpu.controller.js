'use strict';

const os = require('os');
import * as script from '../../system/system.service';

export function index(req, res) {
  var cpu = {
    '1m' : os.loadavg()[0].toFixed(1),
    '5m' : os.loadavg()[1].toFixed(1),
    '15m' : os.loadavg()[2].toFixed(1),
  };
  cpu.chartData = [];
  script.execPromise('data cpu')
    .then(function(result) {
      result.stdout.split('\n').forEach(function(elt) {
        if (elt.indexOf(':') > 0) {
          var stat = elt.split(':');
          if (stat.length === 2) {
            stat[1] = parseFloat(stat[1].replace(',', '.'));
            cpu.chartData.push(stat)
          }
        }
      });
      cpu.chartData = JSON.stringify(cpu.chartData)
      res.status(200).json(cpu);
    })
    .catch(function(error) {
      res.status(200).json(cpu);
    })

  // res.status(200).json(cpu);
}
