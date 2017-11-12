'use strict';

export default class AdvancedController {
  /*@ngInject*/
  constructor($scope, $http, toastr, KupikiModal, $translate) {
    this.$http = $http;
    this.$scope = $scope;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = {
      configuration: true
    };

    this.loadConfiguration();
  }

  saveConfiguration () {
    this.restart = true;

    var options = {
      dismissable: true,
      title: 'Save Hostapd configuration',
      bindHtml: '<p>Are you sure that you want to save your settings ?<br>' +
        '<input type="checkbox" id="restart" name="restart" ng-checked="$parent.vm.restart" ng-model="$parent.vm.restart"> Restart Hostapd service</p>'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    var parent = this;
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http({
        url: '/api/hotspot/configuration',
        method: "POST",
        data: { 'configuration' : parent.configuration.data, 'restart' : parent.restart }
      }).then(function(response) {
        switch (response.data.status) {
          case 'success' :
            toastr.success('Hostapd configuration has been saved', 'Hostapd');
            break;
          case 'failed' :
            toastr.error('Unable to save hostapd configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'Hostapd issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      }, function(response) {
        var message = "Unable to save hostapd configuration";
        toastr.error(message, 'Hostapd configuration', {
          closeButton: true,
          timeOut: 0
        });
      });
    });
  }

  loadDefaultConfiguration () {
    var $http = this.$http;
    var toastr = this.toastr;
    var $translate = this.$translate;
    var parent = this;
    var options = {
      dismissable: true,
      title: this.$translate.instant('management.advanced.default.title'),
      html: this.$translate.instant('management.advanced.default.confirm')
    };
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http.get('/api/hotspot/default')
        .then(response => {
          parent.configuration = {
            error: false,
            data: JSON.parse(JSON.stringify(response.data.result.message))
          };
          parent.extendConfiguration();
          toastr.success('Default Hostapd configuration has been loaded', 'Hostapd');
        })
        .catch(error => {
          console.log(error);
          toastr.error('Unable to get default Kupiki configuration.', 'Hostapd', {
            closeButton: true,
            allowHtml: true,
            timeOut: 0
          });
        });
    });
  }

  extendConfiguration () {
    let parent = this;
    this.$http.get('/api/hotspot/configurationFields')
      .then(response => {
        parent.hotspotConfFields = response.data.result.message;
        for (let i = 0; i < parent.configuration.data.length; i++) {
          let elt = parent.configuration.data[i];
          if (parent.hotspotConfFields[elt.field]) {
            parent.configuration.data[i] = Object.assign({},elt, parent.hotspotConfFields[elt.field]);
            if (parent.configuration.data[i].type === 'number') parent.configuration.data[i].value = parseInt(parent.configuration.data[i].value);
          }
        }
      });
  }

  reloadConfiguration () {
    let parent = this;
    let options = {
      dismissable: true,
      title: this.$translate.instant('management.advanced.reload.title'),
      html: this.$translate.instant('management.advanced.reload.confirm')
    };
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      parent.loadConfiguration();
    });
  }

  loadConfiguration () {
    this.loading.configuration = true;
    this.$http.get('/api/hotspot/configuration')
      .then(response => {
        this.configuration = {};
        switch (response.data.status) {
          case 'success' :
            this.configuration = {
              error: false,
              data: response.data.result.message,
            };
            this.extendConfiguration();
            this.loading.configuration = false;
            break;
          case 'failed' :
            this.toastr.error(this.$translate.instant('management.advanced.load.error-load')+'<br/>'+this.$translate.instant('generic.Error')+' ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.configuration = false;
            this.configuration.error = true;
            break;
        }
      })
      .catch(error => {
        console.log(error);
        this.toastr.error(this.$translate.instant('management.advanced.load.error-load')+'<br/>'+this.$translate.instant('generic.Error')+' ' + error.status + '<br/>' + error.statusText, 'System issue', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.configuration = false;
        this.configuration.error = true;
      });
  }
}
