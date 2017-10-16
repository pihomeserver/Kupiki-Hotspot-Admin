'use strict';

const os = require('os');
import * as script from '../../system/system.service';

function formatBytes(a,b){if(0==a)return{value:0,unit:'Bytes'};var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return {value:parseFloat((a/Math.pow(c,f)).toFixed(d)),unit:e[f]}};

export function index(req, res) {
  var memory = {
    free: '',
    freeUnit: '',
    total: '',
    totalUnit: '',
    percent: undefined
  };
  var freeMem = formatBytes(os.freemem(), 0);
  var totalMem = formatBytes(os.totalmem(), 0);
  memory.free = freeMem.value.toFixed(0);
  memory.freeUnit = freeMem.unit;
  memory.total = totalMem.value.toFixed(0);
  memory.totalUnit = totalMem.unit;
  if (totalMem.value !== 0) memory.percent = 100*os.freemem()/os.totalmem();
  memory.chartMaxY = os.totalmem();
  memory.chartData = [];
  script.execPromise('data memory')
    .then(function(result) {
      result.stdout.split('\n').forEach(function(elt) {
        if (elt.indexOf(':') > 0) {
          var stat = elt.split(':');
          if (stat.length === 2) {
            stat[1] = parseFloat(stat[1].replace(',', '.'));
            memory.chartData.push(stat)
          }
        }
      });
      memory.chartData = JSON.stringify(memory.chartData)
      res.status(200).json(memory);
    })
    .catch(function(error) {
      res.status(200).json(memory);
    })

  // res.status(200).json(memory);
}
