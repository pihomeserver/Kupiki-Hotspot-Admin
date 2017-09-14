'use strict';

const os = require('os');
const exec = require('child-process-promise').exec;

let socket = undefined;

export function register(socketToRegister) {
  console.log('Socket registered for system.controller');
  socket = socketToRegister;
}

export function upgrade(req, res) {
  var command = "apt-get upgrade -s | grep -P '^\d+ upgraded' | cut -d' ' -f1";
  // var command = "echo 2";
  exec(command)
      .then(function (result) {
        console.log('** Result')
        console.log(result)
        if (!result.stderr) {
          var n = result.stdout.replace(/\n$/, "")
          if (!isNaN(parseFloat(n)) && isFinite(n)) {
            res.status(200).json({ status: 'success', result: n });
          } else {
            res.status(200).json({ status: 'failed', result: {code : -1, message : 'Not numeric value returned'} });
          }
        } else {
          res.status(200).json({ status: 'failed', result: {code : result.code, message : result.stderr} });
        }
      })
      .catch(function (err) {
        console.log('** Error')
        console.log(err)
        res.status(200).json({ status: 'failed', result: {code : err.code, message : err.stderr} });
      });
}

export function reboot(req, res) {
  console.log('** Reboot in progress');
  res.status(200).json('');
}

export function shutdown(req, res) {
  console.log('** Shutdown in progress');
  res.status(200).json('');
}

export function update(req, res) {
  var command = 'apt-get update -y -qq && apt-get -qq -y -o "Dpkg::Options::=--force-confdef" -o "Dpkg::Options::=--force-confold" upgrade';
  if (socket) {
    exec(command)
        .then(function (result) {
          socket.emit('system:updateEnd', { status: 'success', result: result });
            // var stdout = result.stdout;
            // var stderr = result.stderr;
            // console.log('stdout: ', stdout);
            // console.log('stderr: ', stderr);
        })
        .catch(function (err) {
          console.log('** Error')
          console.log(err)
          socket.emit('system:updateEnd', {status: 'failed', result: err});
        });
    // setTimeout(function() {
    //   if (socket) {
    //     socket.emit('system:updateEnd', {status: 'failed'});
    //   }
    // }, 2000);
    res.status(200).json('');
  } else {
    res.status(500).json('Socket not registred');
  }
}
