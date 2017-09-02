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

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import coreuiComponents from '../components/coreui/coreui.components';
import coreuiDirectives from '../components/coreui/coreui.directives';
import sidebar from '../components/sidebar/sidebar.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import widget from '../components/widget/widget.component';
import card from '../components/card/card.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';

angular.module('kupikiHotspotAdminApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io',
  uiRouter, uiBootstrap, _Auth, account, admin, 'validation.match', coreuiComponents, coreuiDirectives, navbar, sidebar, footer,
  widget, card, main, constants, socket, util
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
