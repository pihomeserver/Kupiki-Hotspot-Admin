'use strict';

export default class SysadminController {
  /*@ngInject*/
  constructor($scope, $http, $sce, socket, toastr, KupikiModal) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;

    this.print = function() {
      console.log('Yo')
    };

    this.hotspotConfFields = {
      interface: {
        display: 'Wifi interface',
        help: 'Interface that will be used to create the Wifi hotspot',
        type: 'select',
        data: [{text:'wlan0', value: 'wlan0'}]
      },
      driver: {
        display: 'Chipset driver',
        help: 'Driver to activate the Wifi chipset',
        type: 'select',
        data: [{text:'nl80211', value: 'nl80211'}]
      },
      ssid: {
        display: 'SSID',
        help: 'Name that will be visible on users\' devices',
        type: 'text'
      },
      hw_mode: {
        display: 'Wifi mode',
        help: 'Operation mode (a = IEEE 802.11a, b = IEEE 802.11b, g = IEEE 802.11g,' +
        'ad = IEEE 802.11ad (60 GHz); a/g options are used with IEEE 802.11n, too, to ' +
        'specify band). Default: IEEE 802.11b',
        type: 'select',
        data: [{text:'a', value: 'a'}, {text:'b', value: 'b'}, {text:'g', value: 'g'}]
      },
      channel: {
        display: 'Channel',
        help: 'Channel number (IEEE 802.11)',
        type: 'number',
        data: {min: 1, max: 14}
      },
      auth_algs: {
        display: 'Authentication',
        help: 'IEEE 802.11 specifies two authentication algorithms. hostapd can be ' +
        'configured to allow both of these or only one. Open system authentication ' +
        'should be used with IEEE 802.1X.',
        type: 'select',
        data: [{text:'no authentication', value: 0}, {text:'wpa', value: 1}, {text:'wep', value: 2}, {text:'both', value: 3}]
      },
      beacon_int: {
        display: 'Beacon interval in kus',
        help: 'Beacon interval in kus (1.024 ms) (default: 100; range 15..65535)',
        type: 'number',
        data: {min: 15, max: 65535}
      },
      dtim_period: {
        display: 'Delivery Traffic Information Message',
        help: 'DTIM (delivery traffic information message) period (range 1..255): ' +
        'number of beacons between DTIMs (1 = every beacon includes DTIM element). (default: 2)',
        type: 'number',
        data: {min: 1, max: 255}
      },
      max_num_sta: {
        display: 'Maximum number of stations',
        help: 'Maximum number of stations allowed in station table. New stations will be ' +
        'rejected after the station table is full. IEEE 802.11 has a limit of 2007 ' +
        'different association IDs, so this number should not be larger than that. ' +
        '(default: 2007)',
        type: 'number',
        data: {min: 1, max: 2007}
      },
      rts_threshold: {
        display: 'RTS/CTS threshold',
        help: 'RTS/CTS threshold; 2347 = disabled (default); range 0..2347. ' +
        'If this field is not included in hostapd.conf, hostapd will not control ' +
        'RTS threshold and \'iwconfig wlan# rts <val>\' can be used to set it.',
        type: 'number',
        data: {min: 0, max: 2347}
      },
      fragm_threshold: {
        display: 'Fragmentation threshold',
        help: 'Fragmentation threshold; 2346 = disabled (default); range 256..2346. ' +
        'If this field is not included in hostapd.conf, hostapd will not control ' +
        'fragmentation threshold and \'iwconfig wlan# frag <val>\' can be used to set it.',
        type: 'number',
        data: {min: 256, max: 2346}
      }
    };

    // console.log(this.hotspotConfFields['driver'])
  }

  $onInit() {
    this.loading = {
      configuration: true
    };
    this.$http.get('/api/hotspot/configuration')
      .then(response => {
        this.configuration = {};
        switch (response.data.status) {
          case 'success' :
            this.data = response.data.result.message;
            this.configuration = {
              error: false,
              data: response.data.result.message,
            };
            for (let i = 0; i < this.configuration.data.length; i++) {
              let elt = this.configuration.data[i];
              if (this.hotspotConfFields[elt.field]) {
                this.configuration.data[i] = Object.assign({},elt, this.hotspotConfFields[elt.field]);
                if (this.configuration.data[i].type === 'number') this.configuration.data[i].value = parseInt(this.configuration.data[i].value);
              }
            }
            this.loading.configuration = false;
            break;
          case 'failed' :
            this.toastr.error('Unable to get current hostapd configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
              closeButton: true,
              allowHtml: true,
              timeOut: 0
            });
            this.loading.configuration = false;
            this.configuration.error = true;
            break;
        };
      })
      .catch(error => {
        this.toastr.error('Unable to get current hostapd configuration.<br/>Error ' + response.data.result.code + '<br/>' + response.data.result.message, 'System issue', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.loading.configuration = false;
        this.configuration.error = true;
      });
  }
}
