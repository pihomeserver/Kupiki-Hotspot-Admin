'use strict';

export default class BasicController {
  /*@ngInject*/
  constructor($scope, $http, toastr, KupikiModal, $q) {
    this.$http = $http;
    this.$scope = $scope;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;
    this.$q = $q;
  }

  $onInit() {
    this.loading = {
      hostapd: true,
      portal : true
    };
    this.configuration = {};

    this.portalBackground = '/assets/upload/background.jpg';

    this.loadHostapdConfiguration();

    this.loadPortalConfiguration();
  }

  alertMessage(message) {
    alert(message);
  }

  reloadBackground () {
    var options = {
      dismissable: true,
      title: 'Restore default background of the portal',
      html: '<p>Are you sure that you want to restore the default background ?</p>'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    var parent = this;

    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      $http.post('/api/portal/defaultbackground')
        .then(response => {
          var d = new Date();
          $('#portalBackground').attr('src', parent.portalBackground+'?'+d.getTime());
          toastr.success('Default background restored', 'Hotspot portal');
        })
        .catch(error => {
          console.log(error);
          toastr.error('Unable to get default background', 'Hotspot portal', {
            closeButton: true,
            allowHtml: true,
            timeOut: 0
          });
        });
    });
  }

 uploadFile () {
   var file = this.backgroundFile;
   if (!file.type || file.type.indexOf('image') === -1) {
     this.toastr.error('The selected file is not an image', 'Hostpot background', {
       closeButton: true,
       allowHtml: true,
       timeOut: 0
     });
   } else {
     var fd = new FormData();
     fd.append('file', file);

     this.$http.post('/api/portal/background',fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
     })
     .then(response => {
       this.toastr.success('File uploaded successfully.', 'Hostpot background');
       var d = new Date();
       $('#portalBackground').attr('src', this.portalBackground+'?'+d.getTime());
     })
     .catch(error => {
       this.toastr.error('Unable to upload file<br/>Error: '+error, 'Hostpot background', {
         closeButton: true,
         allowHtml: true,
         timeOut: 0
       });
     });
   }
  }

  saveHostapdConfiguration () {
    this.restart = true;
    var options = {
      dismissable: true,
      title: 'Save Hotspot configuration',
      bindHtml: '<p>Are you sure that you want to save your settings ?<br>' +
        '<input type="checkbox" id="restart" name="restart" ng-checked="$parent.vm.restart" ng-model="$parent.vm.restart"> Restart Hostapd service (recommanded)</p>'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    var parent = this;
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      $http({
        url: '/api/hotspot/configuration',
        method: "POST",
        data: { 'configuration' : parent.configuration.hostapd.data, 'restart' : parent.restart }
      }).then(function(response) {
        switch (response.data.status) {
          case 'success' :
            toastr.success('Hotspot configuration has been saved', 'Hostapd');
            break;
          case 'failed' :
            toastr.error('Unable to save Hotspot configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'Hotspot issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      }, function(response) {
        var message = "Unable to save Hotspot configuration";
        toastr.error(message, 'Hotspot configuration', {
          closeButton: true,
          timeOut: 0
        });
      });
    });
  }

  reloadHostapdConfiguration () {
    var parent = this;
    var options = {
      dismissable: true,
      title: 'Reload Hostapd configuration',
      html: '<p>Are you sure that you want to reload current settings ?</p>'
    };
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      parent.loadHostapdConfiguration();
    });
  }

  reloadPortalConfiguration () {
    var parent = this;
    var options = {
      dismissable: true,
      title: 'Reload Portal configuration',
      html: '<p>Are you sure that you want to reload current settings ?</p>'
    };
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      parent.loadPortalConfiguration();
    });
  }

  savePortalConfiguration() {
    var options = {
      dismissable: true,
      title: 'Save Portal configuration',
      bindHtml: '<p>Are you sure that you want to save your settings ?</p>'
    };
    var $http = this.$http;
    var toastr = this.toastr;
    var parent = this;
    this.KupikiModal.confirmModal(options, 'primary', this, function() {
      $http({
        url: '/api/portal/configuration',
        method: "POST",
        data: { 'configuration' : parent.configuration.portal }
      }).then(function(response) {
        switch (response.data.status) {
          case 'success' :
            toastr.success('Portal configuration has been saved', 'Portal');
            break;
          case 'failed' :
            toastr.error('Unable to save Portal configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'Portal issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            break;
        }
      }, function(response) {
        var message = "Unable to save Portal configuration";
        toastr.error(message, 'Portal configuration', {
          closeButton: true,
          timeOut: 0
        });
      });
    });
  }

  loadPortalConfiguration () {
    this.loading.portal = true;
    this.$http.get('/api/portal/configuration')
      .then(response => {
        this.configuration.portal = {};
        switch (response.data.status) {
          case 'success' :
            this.configuration.portal = JSON.parse(response.data.result.message)
            this.loading.portal = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get current portal configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.portal = false;
            break;
        }
        console.log(this.configuration.portal.options)
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to get current portal configuration.<br/>Error ' + error.status + '<br/>' + error.statusText, 'System issue', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.portal = false;
      });
  }

  loadHostapdConfiguration () {
    this.loading.hostapd = true;
    this.$http.get('/api/hotspot/configuration')
      .then(response => {
        this.configuration.hostapd = {};
        switch (response.data.status) {
          case 'success' :
            this.configuration.hostapd = {
              data: response.data.result.message
            };
            var ssidIndex = -1;
            this.configuration.hostapd.data.forEach(function(x, index) {
              if (x.field === 'ssid') {
                ssidIndex = index;
              }
            });
            this.configuration.hostapd.ssid = ssidIndex;
            this.loading.hostapd = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get current hostapd configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.hostapd = false;
            break;
        }
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to get current hostapd configuration.<br/>Error ' + error.status + '<br/>' + error.statusText, 'System issue', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.hostapd = false;
      });
  }
}
