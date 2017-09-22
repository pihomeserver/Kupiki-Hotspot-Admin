'use strict';

import angular from 'angular';
import SysadminController from './sysadmin.controller';

export default angular.module('kupikiHotspotAdminApp.sysadmin', [])
  .controller('SysadminController', SysadminController)
  .name;
