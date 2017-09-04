'use strict';

// const exec = require('child-process-promise').exec;

const os = require('os');


export function index(req, res) {
  //uptime | awk -F'( |,|:)+' '{if ($7=="min") m=$6; else {if ($7~/^day/) {d=$6;h=$8;m=$9} else {h=$6;m=$7}}} {print d+0,",",h+0,",",m+0}'

  // var uptime = {
  //   days: 0,
  //   hours: 0,
  //   minutes: 0
  // };

  res.status(200).json(os.uptime());
  // var uptime_commands = {
  //   linux : "uptime | awk -F'( |,|:)+' '{if ($7==\"min\") m=$6; else {if ($7~/^day/) {d=$6;h=$8;m=$9} else {h=$6;m=$7}}} {print d+0,\",\",h+0,\",\",m+0}'",
  //   Darwin : "uptime | awk -F'( |,|:)+' '{d=0;h=$4;m=$5} {print d+0,\",\",h+0,\",\"m+0}'"
  // };
  // exec(uptime_command)
  //       .then(function (result) {
  //         var stdout = result.stdout.split(',');
  //         uptime.days = parseInt(stdout[0].trim());
  //         uptime.hours = parseInt(stdout[1].trim());
  //         uptime.minutes = parseInt(stdout[2].trim());
  //       })
  //       .catch(function (err) {
  //         console.error('ERROR: ', err);
  //       })
  //       .finally(function(){
  //         res.status(200).json(uptime);
  //       })
  // };
}
