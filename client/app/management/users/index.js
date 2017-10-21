'use strict';

import angular from 'angular';
import UsersMgmtController from './users.controller';

export default angular.module('kupikiHotspotAdminApp.usersmgmt', [])
  .controller('UsersMgmtController', UsersMgmtController)
  .name;
