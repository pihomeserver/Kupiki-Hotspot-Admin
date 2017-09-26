'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './hotspot.routes';
import hotspotadmin from './hotspotadmin';

export default angular.module('kupikiHotspotAdminApp.hotspot', [uiRouter, hotspotadmin])
  .config(routing)
  .name;
