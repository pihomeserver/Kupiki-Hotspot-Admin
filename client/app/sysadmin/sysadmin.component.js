'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './sysadmin.routes';

export class SysadminComponent {
  /*@ngInject*/
  constructor($scope, $http, KupikiModal) {
    this.$http = $http;
    this.$scope = $scope;

    this.reboot = function() {
      var options = {
        dismissable: true,
        title: 'System reboot',
        html: 'Please confirm that you want to restart the system'
      };
      KupikiModal.confirmModal(options, 'modal-danger', function() {
        console.log('Go for reboot')
      });
    };

    this.$scope.switchService = function(elt) {
        console.log(elt)
    };

    this.$scope.filterServices = function(switchStatus) {
      if (switchStatus) {
        let filters = ['chilli', 'freeradius', 'nginx', 'hostapd'];
        let filterByName = function(service) {
          return filters.includes(service.name);
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
  }

  update() {
    console.log("update")
  }

  shutdown() {
    console.log("shutdown")
  }
}

export default angular.module('kupikiHotspotAdminApp.sysadmin', [uiRouter])
  .config(routes)
  .component('sysadmin', {
    template: require('./sysadmin.html'),
    controller: SysadminComponent
  })
  .name;
