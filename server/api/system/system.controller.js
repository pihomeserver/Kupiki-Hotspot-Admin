'use strict';

const os = require('os');
const exec = require('child-process-promise').exec;
const spawn = require('child-process-promise').spawn;

let socket = undefined;

export function register(socketToRegister) {
  console.log('Socket registered for system.controller');
  socket = socketToRegister;
}

export function upgrade(req, res) {
  // var command = "/usr/bin/apt-get upgrade -s | /bin/grep -P '^\d+ upgraded' | /usr/bin/cut -d' ' -f1";
  spawn('/usr/bin/apt-get', ['upgrade', '-s'], { capture: [ 'stdout', 'stderr' ]})
  // spawn('ls', ['-l'], { capture: [ 'stdout', 'stderr' ]})
    .then(function (result) {
      // var p = spawn('/bin/grep', ['-P', "'^\d+ upgraded'"], { capture: ["stdout"] })
      // var c2 = spawn('grep', ['x'], { capture: ["stdout"] })
      var c2 = spawn('/bin/grep', ['-P', "'^\d+ upgraded'"], { capture: ["stdout"] })
              .progress(function(childProcess) {
                childProcess.stdin.write(new Buffer(result.stdout));
                childProcess.stdin.end();
              })
              .then(function(c2_result) {
                var c3 = spawn('/usr/bin/cut', ["-d' '", '-f1'], { capture: ["stdout"] })
                        .progress(function(childProcess) {
                          childProcess.stdin.write(new Buffer(c2_result.stdout));
                          childProcess.stdin.end();
                        })
                        .then(function(c3_result) { return c3_result })
                        .catch(function(err) {
                          res.status(200).json({ status: 'failed', result: { code : err.code, message : err.stderr} });
                        });
                c3.then(function(c3_result) {
                  res.status(200).json({ status: 'success', result: c3_result.stdout.trim() });
                })
              })
              .catch(function(err) {
                res.status(200).json({ status: 'failed', result: { code : err.code, message : err.stderr} });
              });
    })
    .catch(function (err) {
        res.status(200).json({ status: 'failed', result: { code : err.code, message : err.stderr} });
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
