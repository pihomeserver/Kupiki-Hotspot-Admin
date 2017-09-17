'use strict';

const os = require('os');
const spawn = require('child_process').spawn;

let socket = undefined;

export function register(socketToRegister) {
  console.log('Socket registered for system.controller');
  socket = socketToRegister;
}

export function upgrade(req, res) {
  if (os.platform() === 'linux') {
    const apt = spawn('/usr/bin/apt-get', ['upgrade', '-s']);
    const tail = spawn('tail', ['-1']);
    const cut = spawn('cut', ['-f1', '-d ']);
    let result = '';

    apt.stdout.on('data', (data) => {
      try {
        tail.stdin.write(data);
      } catch (err) {
      }
    });

    tail.stdout.on('data', (data) => {
      try {
        cut.stdin.write(data);
      } catch(err) {
      }
    });

    cut.stdout.on('data', (data) => {
      result += data.toString();
    });

    apt.stderr.on('data', (data) => {
      console.log(`apt stderr: ${data}`);
    });

    tail.stderr.on('data', (data) => {
      console.log(`tail stderr: ${data}`);
    });

    cut.stderr.on('data', (data) => {
      console.log(`cut stderr: ${data}`);
    });

    apt.on('close', (code) => {
      if (code !== 0) {
        console.log(`apt process exited with code ${code}`);
        res.status(200).json({ status: 'failed', result: { code : code, message : 'apt-get process exited abnormaly.'} });
      }
      tail.stdin.end();
    });

    tail.on('close', (code) => {
      if (code !== 0) {
        console.log(`tail process exited with code ${code}`);
        res.status(200).json({ status: 'failed', result: { code : code, message : 'tail process exited abnormaly.'} });
      }
      cut.stdin.end();
    });

    cut.on('close', (code) => {
      if (code !== 0) {
        console.log(`cut process exited with code ${code}`);
        res.status(200).json({ status: 'failed', result: { code : code, message : 'cut process exited abnormaly.'} });
      } else {
        res.status(200).json({ status: 'success', result: result.trim() });
      }
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
}

export function reboot(req, res) {
  console.log('** Reboot in progress');
  if (os.platform() === 'linux') {
    const reboot = spawn('/sbin/reboot');
    reboot.stderr.on('data', (data) => {
      console.log(`reboot stderr: ${data}`);
      res.status(200).json({ status: 'failed', result: { code : 1, message : `${data}`} });
    });
    reboot.on('close', (code) => {
      if (code !== 0) {
        console.log(`reboot process exited with code ${code}`);
        // res.status(200).json({ status: 'failed', result: { code : code, message : 'reboot process exited abnormaly.'} });
      } else {
        res.status(200).json({ status: 'success', result: '' });
      }
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
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
