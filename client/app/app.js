'use strict';

import 'tether';
import 'jquery';
import 'bootstrap';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import 'angular-socket-io';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-validation-match';
import uiGrid from 'angular-ui-grid';
import toastr from  'angular-toastr';
import 'angular-xeditable';
import 'checklist-model';
import chartJs from 'angular-chart.js';
import vAccordion from 'v-accordion';
import angularMoment from 'angular-moment';
import translate from 'angular-translate';
import translateLoader from 'angular-translate-loader-static-files';
import {
  routeConfig
} from './app.config';
import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import system from './system';
import management from './management';
import configuration from './configuration';
import constants from './app.constants';
import fileModel from '../components/fileModel/fileModel.directive';
import compile from '../components/compile/compile.directive';
import sidebar from '../components/sidebar/sidebar.component';
import navbar from '../components/navbar/navbar.component';
import kupikiButton from '../components/kupikiButton/kupikiButton.component';
import widget from '../components/widget/widget.component';
import card from '../components/card/card.component';
import KupikiModal from '../components/kupikiModal/kupikiModal.service';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';

angular.module('kupikiHotspotAdminApp', [
  ngCookies,
  ngAnimate,
  ngResource,
  ngSanitize,
  'btford.socket-io',
  uiRouter,
  uiBootstrap,
  'ui.bootstrap.tooltip',
  _Auth,
  'validation.match',
  'xeditable',
  'checklist-model',
  translate,
  translateLoader,
  chartJs,
  account,
  admin,
  navbar,
  sidebar,
  widget,
  card,
  KupikiModal,
  kupikiButton,
  system,
  management,
  configuration,
  compile,
  fileModel,
  constants,
  socket,
  util,
  uiGrid,
  vAccordion,
  angularMoment,
  'ui.grid.selection',
  'ui.grid.resizeColumns',
  'ui.grid.autoResize',
  'ui.grid.pinning',
  'ui.grid.pagination',
  toastr
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, editableOptions, editableThemes) {
    'ngInject';

    editableOptions.theme = 'bs3';
    editableThemes.bs3.submitTpl = '<button class="btn btn-sm btn-primary btn-kupiki-edit" type="submit"><i class="icofont icofont-save"></i></button>';
    editableThemes.bs3.cancelTpl = '<button class="btn btn-sm btn-danger btn-kupiki-edit" ng-click="$form.$cancel()"><i class="icofont icofont-undo"></i></button>';
    editableThemes.bs3.inputClass= 'form-control-sm';

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

    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', function() {
      $("[class*='nav-link active']").removeClass('active');
      $(this).addClass('active');
    });

    $(document).on('click.bs.tab.data-api', '[data-toggle="dropdown"]', function() {
      $(".nav-item.dropdown").children('div.dropdown-menu').removeClass('show')
      $(this).parent().children('div.dropdown-menu').toggleClass('show');
    });

    $(document).on('click', function() {
      $(".nav-item.dropdown").children('div.dropdown-menu').removeClass('show')
    });
  });
