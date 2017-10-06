'use strict';

import angular from 'angular';
import SecurityController from './security.controller';

export default angular.module('kupikiHotspotAdminApp.security', [])
  .controller('SecurityController', SecurityController)
  .name;
