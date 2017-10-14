'use strict';

const execChildPromise = require('child-process-promise').exec;
const execChild = require('child_process').exec;
const shared = require('../config/environment/shared');

export function execPromise(command) {
  return execChildPromise('sudo /etc/kupiki/kupiki.sh '+command, { timeout : shared.httpSudoTimeout })
}

export function exec(command) {
  return execChild('sudo /etc/kupiki/kupiki.sh '+command, { timeout : shared.httpSudoTimeout })
}
