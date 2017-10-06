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
      configuration: true
    };

    this.portalBackground = '/assets/upload/background.jpg';

    this.loadConfiguration();
  }

  reloadBackground () {
    var options = {
      dismissable: true,
      title: 'Restore default background of the portal',
      html: '<p>Are you sure that you want to restore the default background ?'
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

  saveConfiguration () {
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
    this.KupikiModal.confirmModal(options, 'danger', this, function() {
      $http({
        url: '/api/hotspot/configuration',
        method: "POST",
        data: { 'configuration' : parent.configuration.data, 'restart' : parent.restart }
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

  reloadConfiguration () {
    var parent = this;
    var options = {
      dismissable: true,
      title: 'Reload Hostapd configuration',
      html: '<p>Are you sure that you want to reload current settings ?'
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
              data: response.data.result.message
            };
            var ssidIndex = -1;
            this.configuration.data.forEach(function(x, index) {
              if (x.field === 'ssid') {
                ssidIndex = index;
              }
            });
            this.configuration.ssid = ssidIndex;
            this.loading.configuration = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get current hostapd configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.configuration = false;
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
        this.loading.configuration = false;
      });
  }
}
