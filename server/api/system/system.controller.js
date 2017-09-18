'use strict';

const os = require('os');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const spawnPromise = require('child-process-promise').spawn;
const execPromise = require('child-process-promise').exec;

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
        res.status(200).json({ status: 'success', result: { code : 0, message : result.trim() }});
      }
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
}

export function reboot(req, res) {
  if (os.platform() === 'linux') {
    const reboot = exec('sudo shutdown -r -t 1');
    reboot.stderr.on('data', (data) => {
      console.log(`reboot stderr: ${data}`);
    });
    reboot.on('close', (code) => {
      if (code !== 0) {
        console.log(`reboot process exited with code ${code}`);
        res.status(200).json({ status: 'failed', result: { code : code, message : 'Reboot process exited abnormaly.<br/>Check server logs.'} });
      } else {
        res.status(200).json({ status: 'success', result: { code : 0, message : 'Reboot executed in one minute' }});
      }
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
}

export function shutdown(req, res) {
  if (os.platform() === 'linux') {
    const shutdown = exec('sudo shutdown -t 1');
    shutdown.stderr.on('data', (data) => {
      console.log(`shutdown stderr: ${data}`);
    });
    shutdown.on('close', (code) => {
      if (code !== 0) {
        console.log(`shutdown process exited with code ${code}`);
        res.status(200).json({ status: 'failed', result: { code : code, message : 'Shutdown process exited abnormaly.<br/>Check server logs.'} });
      } else {
        res.status(200).json({ status: 'success', result: { code : 0, message : 'Shutdown executed in one minute' }});
      }
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
}

export function update(req, res) {
  var command = 'apt-get update -y -qq && apt-get -qq -y -o "Dpkg::Options::=--force-confdef" -o "Dpkg::Options::=--force-confold" upgrade';
  if (socket) {
    execPromise(command)
      .then(function (result) {
        socket.emit('system:updateEnd', { status: 'progress', result: result });
        // res.status(200).json({ status : 'success', result: { code : 0, message : 'System updated successfully' }});
        res.status(200).json({ status : 'progress', result: { code : 0, message : 'System updated started' }});
      })
      .catch(function (err) {
        console.log('Update error')
        console.log(err)
        res.status(200).json({ status : 'failed', result: { code : err.code, message : err.stderr }});
        // socket.emit('system:updateEnd', {status: 'failed', result: err});
      });
    // setTimeout(function() {
    //   if (socket) {
    //     socket.emit('system:updateEnd', {status: 'failed'});
    //   }
    // }, 2000);
  } else {
    res.status(200).json({ status : 'failed', result: { code : -1, message : 'Socket not registred' }});
  }
}
