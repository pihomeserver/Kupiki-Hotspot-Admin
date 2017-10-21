'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './management.routes';
import users from './users';
import user from './user';

export default angular.module('kupikiHotspotAdminApp.management', [uiRouter, users, user])
  .config(routing)
  .name;
