'use strict';

const diskspace = require('diskspace');
import * as script from '../../system/system.service';

function formatBytes(a,b){if(0==a)return{value:0,unit:'Bytes'};var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return {value:parseFloat((a/Math.pow(c,f)).toFixed(d)),unit:e[f]}};

export function index(req, res) {
  let disk = {
    free: '',
    freeUnit: '',
    total: '',
    totalUnit: '',
    chartMaxY: 0,
    percent: undefined
  };
  diskspace.check('/', function (err, result) {
    if (err || result.status !== 'READY') {
      res.status(500).json(disk);
    } else {
      var freeDisk = formatBytes(result.free, 0);
      var usedDisk = formatBytes(result.used, 0);
      var totalDisk = formatBytes(result.total, 0);
      disk.free = freeDisk.value.toFixed(1);
      disk.freeUnit = freeDisk.unit;
      disk.used = usedDisk.value.toFixed(1);
      disk.usedUnit = usedDisk.unit;
      disk.total = totalDisk.value.toFixed(1);
      disk.totalUnit = totalDisk.unit;
      disk.percent = 100*result.used/result.total;
      disk.chartMaxY = result.total;

      disk.chartData = [];
      script.execPromise('data disk')
        .then(function(result) {
          result.stdout.split('\n').forEach(function(elt) {
            if (elt.indexOf(':') > 0) {
              var stat = elt.split(':');
              if (stat.length === 2) {
                stat[1] = parseFloat(stat[1].replace(',', '.'));
                disk.chartData.push(stat)
              }
            }
          });
          disk.chartData = JSON.stringify(disk.chartData)
          res.status(200).json(disk);
        })
        .catch(function(error) {
          res.status(200).json(disk);
        })
    }
  });
}


