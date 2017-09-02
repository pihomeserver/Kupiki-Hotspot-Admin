'use strict';

import angular from 'angular';
import LogoutController from './logout.controller';

export default angular.module('kupikiHotspotAdminApp.logout', [])
  .controller('LogoutController', LogoutController)
  .name;
