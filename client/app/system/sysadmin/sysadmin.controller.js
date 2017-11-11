'use strict';

export default class SysadminController {
  /*@ngInject*/
  constructor($scope, $http, socket, toastr, KupikiModal, appConfig, $translate, $rootScope, uiGridConstants) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;
    this.$translate = $translate;
    this.uiGridConstants = uiGridConstants;

    $rootScope.$on('toggleSidebar', (event, data) => {
      this.gridApi.core.handleWindowResize();
    });

    $rootScope.$on('$translateChangeSuccess', (event, data) => {
      if (this.services && this.gridApi && this.gridApi.core) {
        this.services.columnDefs[0].displayName = this.$translate.instant('dashboard.services');
        this.services.columnDefs[1].displayName = this.$translate.instant('dashboard.status');
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.COLUMN);
      }
    });

    this.socket.socket.on('system:update', data => {
      if (data) {
        switch (data.status) {
          case 'success' :
            toastr.success(this.$translate.instant('dashboard.systemupdate.finished'));
            break;
          case 'already' :
            toastr.info(this.$translate.instant('dashboard.systemupdate.alreadyprogress'));
            break;
          case 'progress' :
            toastr.info(this.$translate.instant('dashboard.systemupdate.progress'));
            break;
          case 'failed' :
            toastr.error(this.$translate.instant('generic.Error')+' '+data.result.code+'<br/>'+data.result.stderr, this.$translate.instant('dashboard.systemupdate.title'), {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      } else {
        toastr.error(this.$translate.instant('dashboard.systemupdate.error-status'), this.$translate.instant('dashboard.systemupdate.title'), {
          closeButton: true,
          timeOut: 0
        });
      }
    });

    this.$scope.switchService = function(elt) {
      $http({
        url: '/api/services',
        method: "POST",
        data: { 'service' : elt.name, 'status' : elt.status
        }
      })
        .then(function(response) {
          let message = '';
          switch (response.data.status) {
            case 'success' :
              message = $translate.instant('dashboard.systemservices.success-start', { service: elt.name });
              if (!elt.status) message = $translate.instant('dashboard.systemservices.success-stop', { service: elt.name });
              toastr.success(message);
              break;
            case 'failed' :
              message = $translate.instant('dashboard.systemservices.error-start', { service: elt.name });
              if (!elt.status) message = $translate.instant('dashboard.systemservices.error-stop', { service: elt.name });
              message += '<br/>'+$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message;
              toastr.error(message, 'Service ' + elt.name, {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        },
        function(response) {
          let message = $translate.instant('dashboard.systemservices.error-start', { service: elt.name });
          if (!elt.status) message = $translate.instant('dashboard.systemservices.error-stop', { service: elt.name });
          toastr.error(message, $translate.instant('dashboard.service')+' ' + elt.name, {
            closeButton: true,
            timeOut: 0
          });
        });
    };

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
  }

  $onInit() {
    this.loading = {
      services: true
    };
    this.$http.get('/api/services')
      .then(response => {
        this.services = {};
        switch (response.data.status) {
          case 'success' :
            let cellTemplateButton = "" +
              "<div class='ui-grid-cell-contents'>" +
              "<label class='tgl' style='font-size:10px'>" +
              "<input type='checkbox' ng-checked='row.entity.status' ng-model='row.entity.status' ng-change='grid.appScope.switchService(row.entity)'/>" +
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
                { displayName: this.$translate.instant('dashboard.service'), field: 'name', width: '80%' },
                { displayName: this.$translate.instant('dashboard.status'), field: 'status', cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton}
              ],
              onRegisterApi: gridApi => {
                this.gridApi = gridApi;
              }
            };
            this.loading.services = false;
            break;
          case 'failed' :
            this.toastr.error(this.$translate.instant('dashboard.systemservices.error-information')+'<br/>'+this.$translate.instant('generic.Error')+' ' + response.data.result.code + '<br/>' + response.data.result.message, this.$translate.instant('dashboard.issue'), {
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
        this.toastr.error(this.$translate.instant('dashboard.systemservices.error-information')+'<br/>'+this.$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.issue'), {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.services = false;
        this.services.error = true;
      });
    this.$http.get('/api/system/upgrade')
      .then(response => {
        this.availableUpgrades = undefined;
        switch (response.data.status) {
          case 'success' :
            if (parseInt(response.data.result.message) !== 0) {
              this.availableUpgrades = parseInt(response.data.result.message);
              this.toastr.info(this.$translate.instant('dashboard.systemupdate.available', { availableUpgrades: this.availableUpgrades }), this.$translate.instant('dashboard.systemupdate.title'));
            } else {
              this.toastr.info(this.$translate.instant('dashboard.systemupdate.confirm'), this.$translate.instant('dashboard.systemupdate.title'));
            }
            break;
          case 'failed' :
            this.toastr.error(this.$translate.instant('dashboard.systemupdate.error-information')+'<br/>'+this.$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.systemupdate.title'), {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      })
      .catch(error => {
        this.availableUpgrades = undefined;
      });
  }

  shutdown () {
    var options = {
      dismissable: true,
      title: this.$translate.instant('dashboard.systemshutdown.title'),
      html: this.$translate.instant('dashboard.systemshutdown.ask')
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http.get('/api/system/shutdown')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success(this.$translate.instant('dashboard.systemshutdown.confirm'), this.$translate.instant('dashboard.systemshutdown.title'));
              break;
            case 'failed':
              toastr.error(this.$translate.instant('dashboard.systemshutdown.error-executed')+'<br/>'+this.$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.systemshutdown.title'), {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error(this.$translate.instant('dashboard.systemshutdown.error-started'), this.$translate.instant('dashboard.systemshutdown.title'));
        });
    });
  }

  reboot() {
    var options = {
      dismissable: true,
      title: this.$translate.instant('dashboard.systemreboot.title'),
      html: this.$translate.instant('dashboard.systemreboot.ask')
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http.get('/api/system/reboot')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success(this.$translate.instant('dashboard.systemreboot.confirm'), this.$translate.instant('dashboard.systemreboot.title'));
              break;
            case 'failed':
              toastr.error(this.$translate.instant('dashboard.systemreboot.error-execution')+'<br/>'+this.$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.systemreboot.title'), {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error('The reboot of the system can not be started.', 'System reboot');
        });
    });
  }

  update() {
    var options = {
      dismissable: true,
      title: this.$translate.instant('dashboard.systemupdate.title'),
      html: this.$translate.instant('dashboard.systemupdate.ask')
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      $http.get('/api/system/update')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success(response.data.result.message, this.$translate.instant('dashboard.systemupdate.title'));
              break;
            case 'failed':
              toastr.error(this.$translate.instant('dashboard.systemupdate.error-execution')+'<br/>'+this.$translate.instant('generic.Error')+' '+response.data.result.code+'<br/>'+response.data.result.message, this.$translate.instant('dashboard.systemupdate.title'), {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error(this.$translate.instant('dashboard.systemupdate.error-start'), this.$translate.instant('dashboard.systemupdate.title'));
        });
    });
  }
}
