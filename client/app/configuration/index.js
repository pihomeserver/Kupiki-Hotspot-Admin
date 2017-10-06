'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './configuration.routes';
import basic from './basic';
import security from './security';
import advanced from './advanced';

export default angular.module('kupikiHotspotAdminApp.configuration', [uiRouter, basic, security, advanced])
  .config(routing)
  .name;
