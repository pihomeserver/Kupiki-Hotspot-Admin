'use strict';

const diskspace = require('diskspace');

function formatBytes(a,b){if(0==a)return{value:0,unit:'Bytes'};var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return {value:parseFloat((a/Math.pow(c,f)).toFixed(d)),unit:e[f]}};

export function index(req, res) {
  let disk = {
    free: '',
    freeUnit: '',
    total: '',
    totalUnit: '',
    percent: undefined
  };
  diskspace.check('/', function (err, result) {
    if (err || result.status !== 'READY') {
      res.status(500).json(disk);
    } else {
      var freeDisk = formatBytes(result.free, 0);
      var totalDisk = formatBytes(result.total, 0);
      disk.free = freeDisk.value.toFixed(0);
      disk.freeUnit = freeDisk.unit;
      disk.total = totalDisk.value.toFixed(0);
      disk.totalUnit = totalDisk.unit;
      disk.percent = 100*result.free/result.total;
      res.status(200).json(disk);
    }
  });
}


