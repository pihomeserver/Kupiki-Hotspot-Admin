'use strict';

import angular from 'angular';
import SysdashboardController from './sysdashboard.controller';

export default angular.module('kupikiHotspotAdminApp.sysdashboard', [])
  .controller('SysdashboardController', SysdashboardController)
  .name;
