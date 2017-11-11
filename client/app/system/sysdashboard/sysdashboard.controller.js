'use strict';

import moment from 'moment';

export default class SysdashboardController {
  /*@ngInject*/
  constructor($http, $scope, appConfig, toastr, $translate, $rootScope, uiGridConstants) {
    this.$http = $http;
    this.$scope = $scope;
    this.toastr = toastr;
    this.$translate = $translate;
    this.uiGridConstants = uiGridConstants;

    this.$scope.filterServices = function(switchStatus) {
      if (switchStatus) {
        let filterByName = function(service) {
          return appConfig.servicesFilters.includes(service.name);
        };
        this.dataFiltered = this.$scope.$parent.vm.data.filter(filterByName);
        this.$scope.$parent.vm.services.data = this.dataFiltered;
      } else {
        this.$scope.$parent.vm.services.data = this.$scope.$parent.vm.data;
      }
    };

    this.disk = {
      used: '0'
    };
    this.memory = {
      free: '0'
    };
    this.uptime = {
      title: '-',
      subtitle: '-'
    };
    this.cpu = {
      '1m': '0'
    };

    $rootScope.$on('toggleSidebar', (event, data) => {
      this.gridApi.core.handleWindowResize();
    });

    $rootScope.$on('$translateChangeSuccess', (event, data) => {
      if (this.services && this.services.columnDefs) {
        this.services.columnDefs[0].displayName = this.$translate.instant('dashboard.services');
        this.services.columnDefs[1].displayName = this.$translate.instant('dashboard.status');
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.COLUMN);
      }
    });
  }

  $onInit() {
    this.switch = false;
    this.loading = {
      cpu : true,
      disk: true,
      information: true,
      memory: true,
      services: true
    };
    this.$http.get('/api/cpu')
      .then(response => {
        this.cpu = response.data;
        this.cpu.class = "bg-info";
        if (this.cpu.percent > 60) this.cpu.class = "bg-warning";
        if (this.cpu.percent > 90) this.cpu.class = "bg-danger";
        var objData = JSON.parse(this.cpu.chartData);
        this.cpu.chartData = [[]];
        this.cpu.chartLabels = [];
        for (var i = 0; i < objData.length; i++) {
          this.cpu.chartLabels.push(objData[i][0]);
          this.cpu.chartData[0].push(objData[i][1]);
        }

      });
    this.$http.get('/api/disk')
      .then(response => {
        this.disk = response.data;
        this.disk.class = "bg-info";
        if (this.disk.percent > 60) this.disk.class = "bg-warning";
        if (this.disk.percent > 90) this.disk.class = "bg-danger";
        var objData = JSON.parse(this.disk.chartData);
        this.disk.chartData = [[]];
        this.disk.chartLabels = [];
        for (var i = 0; i < objData.length; i++) {
          this.disk.chartLabels.push(objData[i][0]);
          this.disk.chartData[0].push(objData[i][1]);
        }
      });
    this.$http.get('/api/information')
      .then(response => {
        this.information = response.data;
        this.loading.information = false;
      });
    this.$http.get('/api/memory')
      .then(response => {
        this.memory = response.data;
        this.memory.class = "bg-info";
        if (this.memory.percent > 60) this.memory.class = "bg-warning";
        if (this.memory.percent > 90) this.memory.class = "bg-danger";
        var objData = JSON.parse(this.memory.chartData);
        this.memory.chartData = [[]];
        this.memory.chartLabels = [];
        for (var i = 0; i < objData.length; i++) {
          this.memory.chartLabels.push(objData[i][0]);
          this.memory.chartData[0].push(objData[i][1]);
        }
      });
    this.$http.get('/api/services')
      .then(response => {
        this.services = {};
        switch (response.data.status) {
          case 'success' :
            var cellTemplateButton = "" +
              "<div class='ui-grid-cell-contents'>" +
              "<label class='tgl tgl-disabled' style='font-size:10px'>" +
              "<input type='checkbox' disabled ng-checked='row.entity.status'/>" +
              "<span data-on='On' data-off='Off'></span>" +
              "</label>" +
              "</div>";
            this.data = response.data.result.message;
            this.services = {
              error: false,
              switch: 'on',
              enableSorting: true,
              data: response.data.result.message,
              columnDefs: [
                { displayName: "Services", field: 'name', width: '80%' },
                { displayName: "Status", field: 'status', cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton}
              ],
              onRegisterApi: gridApi => {
                this.gridApi = gridApi;
              }
            };
            this.loading.services = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get status of services upgrades.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, this.$translate.instant('dashboard.issue'), {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.services = false;
            this.services.error = true;
            break;
        }
      })
      .catch(error => {
        this.toastr.error('Unable to get status of services upgrades.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.issue'), {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.services = false;
        this.services.error = true;
      });
    this.$http.get('/api/uptime')
      .then(response => {
        var duration = moment.duration(parseInt(response.data), 'seconds');
        this.uptime = {
          days : duration._data.days,
          hours : duration._data.hours,
          minutes : duration._data.minutes,
        };
        this.uptime.subtitle = "";
        if (this.uptime.minutes !== 0) {
          this.uptime.title = this.uptime.minutes;
          this.uptime.unit = "min";
          this.uptime.subtitle = this.uptime.minutes+"m";
        }
        if (this.uptime.hours !== 0) {
          this.uptime.title = this.uptime.hours;
          this.uptime.unit = "hours";
          this.uptime.subtitle = this.uptime.hours+"h "+this.uptime.subtitle;
        }
        if (this.uptime.days !== 0) {
          this.uptime.title = this.uptime.days;
          this.uptime.unit = "days";
          this.uptime.subtitle = this.uptime.days+"d "+this.uptime.subtitle;
        }
        this.uptime.subtitle = "Up "+this.uptime.subtitle;
        this.uptime.class = "bg-info";
      });
  }
}
