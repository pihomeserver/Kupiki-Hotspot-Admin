'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './system.routes';
import sysdashboard from './sysdashboard';
import sysadmin from './sysadmin';

export default angular.module('kupikiHotspotAdminApp.system', [uiRouter, sysdashboard, sysadmin])
  .config(routing)
  .name;
