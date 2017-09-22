'use strict';

import 'tether';
import 'jquery';
import 'bootstrap';

import angular from 'angular';

// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-validation-match';
import uiGrid from 'angular-ui-grid';
import toastr from  'angular-toastr';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import system from './system';
import coreuiDirectives from '../components/coreui/coreui.directives';
import sidebar from '../components/sidebar/sidebar.component';
import navbar from '../components/navbar/navbar.component';
import kupikiButton from '../components/kupikiButton/kupikiButton.component';
import widget from '../components/widget/widget.component';
import card from '../components/card/card.component';
// import MainComponent from './system/sysdashboard/sysdashboard.component';
// import SysadminComponent from './system/sysadmin/sysadmin.component';
import constants from './app.constants';
import KupikiModal from '../components/kupikiModal/kupikiModal.service';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';

angular.module('kupikiHotspotAdminApp', [
  ngCookies,
  // ngAnimate,
  ngResource,
  ngSanitize,
  'btford.socket-io',
  uiRouter,
  uiBootstrap,
  _Auth,
  'validation.match',
  coreuiDirectives,
  account,
  admin,
  navbar,
  sidebar,
  widget,
  card,
  KupikiModal,
  kupikiButton,
  // MainComponent,
  // SysadminComponent,
  system,
  constants,
  socket,
  util,
  uiGrid,
  toastr
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['kupikiHotspotAdminApp'], {
      strictDi: true
    });
  });
