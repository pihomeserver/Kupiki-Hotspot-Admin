'use strict';

export default class SysadminController {
  /*@ngInject*/
  constructor($scope, $http, socket, toastr, KupikiModal, appConfig) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;

    this.socket.socket.on('system:update', function(data) {
      if (data) {
        switch (data.status) {
          case 'success' :
            toastr.success('System update finished');
            break;
          case 'already' :
            toastr.info('System update is already in progress');
            break;
          case 'progress' :
            toastr.info('System update in progress');
            break;
          case 'failed' :
            toastr.error('Error '+data.result.code+'<br/>'+data.result.stderr, 'System update failed', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
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
      $http({
        url: '/api/services',
        method: "POST",
        data: { 'service' : elt.name, 'status' : elt.status
        }
      })
        .then(function(response) {
          var message = '';
          switch (response.data.status) {
            case 'success' :
              message = elt.name+" service started";
              if (!elt.status) message = elt.name+" service stoped";
              toastr.success(message);
              break;
            case 'failed' :
              message = "Unable to start service ";
              if (!elt.status) message = "Unable to stop service ";
              message += elt.name+'<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message;
              toastr.error(message, 'Service ' + elt.name, {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        },
        function(response) {
          var message = "Unable to start "+elt.name+" service";
          if (!elt.status) message = "Unable to stop "+elt.name+" service";
          toastr.error(message, 'Service ' + elt.name, {
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
                { displayName: "Service", field: 'name', width: '80%' },
                { displayName: "Status", field: 'status', cellClass: 'cellTextCentered', cellTemplate: cellTemplateButton}
              ]
            };
            this.loading.services = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get status of services upgrades.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
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
        this.toastr.error('Unable to get status of services upgrades.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
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
            // console.log(response.data)
            if (parseInt(response.data.result.message) !== 0) {
              this.availableUpgrades = parseInt(response.data.result.message);
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
        this.availableUpgrades = undefined;
      });
  }

  shutdown () {
    var options = {
      dismissable: true,
      title: 'System shutdown',
      html: 'Please confirm that you want to shutdown the system'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http.get('/api/system/shutdown')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success('The shutdown of the system has been started.', 'System shutdown');
              break;
            case 'failed':
              toastr.error('Unable to perform the shutdown.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error('The shutdown of the system can not be started.', 'System shutdown');
        });
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
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http.get('/api/system/reboot')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success('The reboot of the system has been started.', 'System reboot');
              break;
            case 'failed':
              toastr.error('Unable to perform the reboot.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error('The reboot of the system can not be started.', 'System shutdown');
        });
    });
  }

  update() {
    var options = {
      dismissable: true,
      title: 'System update',
      html: 'Please confirm that you want to update the system'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      $http.get('/api/system/update')
        .then(response => {
          switch (response.data.status) {
            case 'success':
              toastr.success(response.data.result.message, 'System update');
              break;
            case 'failed':
              toastr.error('Unable to perform the update.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'System issue', {
                closeButton: true,
                allowHtml: true,
                timeOut: 0
              });
              break;
          }
        })
        .catch(function() {
          toastr.error('The update of the system can not be started.', 'System shutdown');
        });
    });
  }
}
