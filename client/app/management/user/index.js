'use strict';

import angular from 'angular';
import UserMgmtController from './user.controller';

export default angular.module('kupikiHotspotAdminApp.usermgmt', [])
  .controller('UserMgmtController', UserMgmtController)
  .name;
