'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './sysadmin.routes';

export class SysadminComponent {
  /*@ngInject*/
  constructor($scope, $http, socket, toastr, KupikiModal, appConfig) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;

    this.socket.socket.on('system:updateEnd', function(data) {
      if (data) {
        // console.log(data)
        switch (data.status) {
          case 'success' :
            toastr.success('System update finished');
            break;
          case 'failed' :
            toastr.error('Error '+data.result.code+'<br/>'+data.result.stderr, 'System update failed', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            console.log(data.result)
            break;
        }
      } else {
        toastr.error('Unable to get update status.', 'System update', {
          closeButton: true,
          timeOut: 0
        });
      }
    });

    this.$scope.switchService = function(elt) {
      console.log("switch service")
      console.log(elt)
    };

    this.shutdown = function() {
      var options = {
        dismissable: true,
        title: 'System shutdown',
        html: 'Please confirm that you want to shutdown the system'
      };
      KupikiModal.confirmModal(options, 'danger', function() {
        console.log('Go for shutdown')
      });
    };

    this.$scope.filterServices = function(switchStatus) {
      if (switchStatus) {
        let filterByName = function(service) {
          return appConfig.servicesFilters.includes(service.name);
        };
        this.dataFiltered = this.$scope.$parent.$ctrl.data.filter(filterByName);
        this.$scope.$parent.$ctrl.services.data = this.dataFiltered;
      } else {
        this.$scope.$parent.$ctrl.services.data = this.$scope.$parent.$ctrl.data;
      }
    }
  }

  $onInit() {
    let cellTemplateButton = "" +
      "<label class='tgl' style='font-size:10px'>" +
      "<input type='checkbox' ng-checked='row.entity.status' ng-model='row.entity.status' ng-change='grid.appScope.switchService(row.entity)'/>" +
      "<span data-on='On' data-off='Off'></span>" +
      "</label>";
    this.$http.get('/api/services')
      .then(response => {
        this.data = response.data;
        this.services = {
          enableSorting: true,
          data: response.data,
          columnDefs: [
            { displayName: "Service", field: 'name', width: '80%' },
            { displayName: "Status", field: 'status', cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton}
          ]
        };
      });
    this.$http.get('/api/system/upgrade')
      .then(response => {
        // console.log(response.data)
        this.availableUpgrades = undefined;
        switch (response.data.status) {
          case 'success' :
            if (parseInt(response.data.result) !== 0) {
              this.availableUpgrades = parseInt(response.data.result);
              this.toastr.info(this.availableUpgrades+' packages available. Please update your system.', 'System update');
            } else {
              this.toastr.info('Your system is up to date.', 'System update');
            }
            break;
          case 'failed' :
            this.toastr.error('Unable to get available upgrades.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
          }
      })
      .catch(error => {
        // console.log('** Error')
        // console.log(error)
        this.availableUpgrades = undefined;
      });
  }

  reboot() {
    var options = {
      dismissable: true,
      title: 'System reboot',
      html: 'Please confirm that you want to restart the system'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'danger', function() {
      console.log('Go for reboot --');
      $http.get('/api/system/reboot')
        .then(response => {
          console.log(response.data)
          switch (response.data.status) {
            case 'success':
              toastr.info('The reboot of the system has been started.', 'System reboot');
              break;
            case 'failed':
              toastr.error('Unable to perform the reboot.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
            };
        })
        .catch(function() {
          toastr.error('The reboot of the system can not be started.', 'System update');
        });
    });
  };

  update() {
    var options = {
      dismissable: true,
      title: 'System update',
      html: 'Please confirm that you want to update the system'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'primary', function() {
      console.log('Go for update --')
      $http.get('/api/system/update')
        .then(response => {
          toastr.info('The update of the system is in progress', 'System reboot');
        })
        .catch(function() {
          toastr.error('The update of the system can not be executed.', 'System reboot');
        });
    });
  };


}

export default angular.module('kupikiHotspotAdminApp.sysadmin', [uiRouter])
  .config(routes)
  .component('sysadmin', {
    template: require('./sysadmin.html'),
    controller: SysadminComponent
  })
  .name;
