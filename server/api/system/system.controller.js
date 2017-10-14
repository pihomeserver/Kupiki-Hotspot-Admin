'use strict';

const os = require('os');

import * as script from '../../system/system.service';

let socket = undefined;

export function register(socketToRegister) {
  console.log('Socket registered for system.controller');
  socket = socketToRegister;
}

export function upgrade(req, res) {
  if (os.platform() === 'linux') {
    script.execPromise('system check')
      .then(function (result) {
        res.status(200).json({status: 'success', result: {code: 0, message: result.stdout.trim() }});
      })
      .catch(function (err) {
        console.log('System update error');
        console.log(err);
        res.status(200).json({status: 'failed', result: {code: err.code, message: err.stderr}});
      });
  } else {
    res.status(200).json({ status: 'failed', result: { code : -1, message : 'Unsupported platform'} });
  }
}

export function reboot(req, res) {
  if (os.platform() === 'linux') {
    const reboot = script.exec('system reboot');
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
    const shutdown = script.exec('system shutdown');
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
  if (socket) {
    socket.emit('system:update', {status: 'progress', result: ''});
    script.execPromise('system update')
      .then(function (result) {
        script.execPromise('system upgrade')
          .then(function (result) {
            res.status(200).json({status: 'success', result: {code: 0, message: 'System updated finished.'}});
          })
          .catch(function (err) {
            console.log('System ugrade error');
            console.log(err);
            res.status(200).json({status: 'failed', result: {code: err.code, message: err.stderr}});
          })
      })
      .catch(function (err) {
        console.log('System update error');
        console.log(err);
        res.status(200).json({status: 'failed', result: {code: err.code, message: err.stderr}});
      });
  } else {
    res.status(200).json({status: 'failed', result: {code: -1, message: 'Socket not registred'}});
  }
}
