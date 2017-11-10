'use strict';

import moment from 'moment';

export default class UserMgmtController {
  /*@ngInject*/
  constructor($http, $stateParams, toastr) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.toastr = toastr;

    this.user = {
      username: this.$stateParams.username,
      title: 'Edit user',
      hasPassword: false,
      passwodType: 'Cleartext',
      passwordClear: '',
      checking: false,
      disconnecting: false,
      loading: {
        radcheck: true,
        radreply: true,
        userinfo: true,
        lastsession: true,
        sessionstotal: true,
        allsessions: true
      },
      radcheck: {},
      radreply: {},
      userinfo: {},
      lastsession: {},
      sessionstotal: {},
      allsessions: {
        connections: {},
        endings: {},
        volume: {}
      }
    };

    // var CryptoJS = require("crypto-js/core");
    // var TripleDES = require("crypto-js/tripledes");
    //
    // var encrypted = CryptoJS.DES.encrypt('toto');
    // console.log(encrypted)
    // console.log(encrypted.toString())
    //
    // var decrypted = CryptoJS.DES.decrypt(encrypted, '');
    // console.log(decrypted)
    // console.log(decrypted.toString(CryptoJS.enc.Utf8))
  }

  formatBytes(a,b) {if(0==a)return{value:0,unit:'Bytes'};var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return {value:parseFloat((a/Math.pow(c,f)).toFixed(d)),unit:e[f]}};

  generatePassword() {
    if (this.user.radcheck[this.user.passwordAttributeIndex] === undefined) this.user.radcheck[this.user.passwordAttributeIndex] = {username: this.user.username, op: ":=", attribute: "Cleartext-Password"};
    if (this.user.radcheck[this.user.passwordAttributeIndex].op === undefined) this.user.radcheck[this.user.passwordAttributeIndex].op = ':=';

    switch(this.user.radcheck[this.user.passwordAttributeIndex].attribute) {
      case 'Cleartext-Password':
        this.user.radcheck[this.user.passwordAttributeIndex].value = this.user.passwordClear;
        break;
      case 'Crypt-Password':
        break;
      case 'MD5-Password':
        break;
    }
  }

  disconnectUser() {
    this.user.disconnecting = true;
    this.$http({
      url: '/api/freeradius/disconnect',
      method: "POST",
      params: { username: this.user.username }
    }).then(response => {
      if (response.data.status === 'success') {
        this.toastr.success('User disconnected', 'User edit');
      } else {
        this.toastr.error('Unable to disconnect '+this.user.username, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      }
      this.user.disconnecting = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to disconnect user.<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.disconnecting = false;
      })
  }



  checkUserConnectivity(form) {
    this.user.checking = true;
    this.$http({
      url: '/api/freeradius/check',
      method: "POST",
      params: { username: this.user.username, password: form.password.$viewValue }
    }).then(response => {
      if (response.data.status === 'success') {
        this.toastr.success('Connectivity checked successfully', 'User edit');
      } else {
        this.toastr.error('Check of the connectivity failed', 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      }
      this.user.checking = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to check connectivity.<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.checking = false;
      })
  }

  saveUserRadcheck(form) {
    if (form.$valid) {
      if (!this.user.hasPassword) {
        this.user.radcheck[this.user.passwordAttributeIndex].username = this.user.userinfo.username;
        this.user.radcheck[this.user.passwordAttributeIndex].op = ":=";
      }

      this.$http({
        url: '/api/freeradius/user/radcheck',
        method: "POST",
        params: { radcheck: this.user.radcheck, username: this.user.username }
      }).then(response => {
        if (response.data.status === 'success') {
          this.toastr.success('Check attributes saved successfully', 'User edit');
        } else {
          this.toastr.error('Unable to save attributes.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'User edit', {
            closeButton: true,
            allowHtml: true,
            timeOut: 0
          });
        }
      })
        .catch(error => {
          console.log(error);
          this.toastr.error('Unable to save attributes<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
            closeButton: true,
            allowHtml: true,
            timeOut: 0
          });
        });
    }
  }

  saveUserUserinfo(form) {
    if (form.$valid) {
      this.$http({
        url: '/api/freeradius/user/userinfo',
        method: "POST",
        params: { userinfo: this.user.userinfo, username: this.user.username }
      }).then(response => {
        if (response.data.status === 'success') {
          this.toastr.success('User information saved successfully', 'User edit');
        } else {
          this.toastr.error('Unable to save information.<br/>Error '+response.data.result.code+'<br/>'+response.data.result.message, 'User edit', {
            closeButton: true,
            allowHtml: true,
            timeOut: 0
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to save information<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      });
    }
  }

  $onInit() {
    this.user.userinfo = {};

    this.user.radcheckGrid = {
      enableSorting: true,
      rowHeight: 35,

      columnDefs: [
        { displayName: "Attribute",   field: 'attribute', enableHiding: false,  pinnedLeft:true },
        { displayName: "Operator",    field: 'op',        enableHiding: false },
        { displayName: "Value",       field: 'value',     enableHiding: false }
      ]
    };

    this.user.radreplyGrid = {
      enableSorting: true,
      rowHeight: 35,

      columnDefs: [
        { displayName: "Attribute",   field: 'attribute', enableHiding: false,  pinnedLeft:true },
        { displayName: "Operator",    field: 'op',        enableHiding: false },
        { displayName: "Value",       field: 'value',     enableHiding: false }
      ]
    };

    this.user.passwordAttributeIndex = -1;

    this.$http({
      url: '/api/freeradius/lastsession',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      if (Array.isArray(response.data) && response.data.length === 1) {
        this.user.lastsession = response.data[0];
        let tmpVar = this.formatBytes(this.user.lastsession.acctinputoctets, 0);
        this.user.lastsession.acctinputoctets = tmpVar.value + ' ' + tmpVar.unit
        tmpVar = this.formatBytes(this.user.lastsession.acctoutputoctets, 0);
        this.user.lastsession.acctoutputoctets = tmpVar.value + ' ' + tmpVar.unit
      }
      this.user.loading.lastsession = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user last session<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.lastsession = false;
      });
    this.$http({
      url: '/api/freeradius/sessionstotal',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      if (Array.isArray(response.data) && response.data.length === 1) {
        this.user.sessionstotal = response.data[0];
        let tmpVar = this.formatBytes(this.user.sessionstotal.downloadTotal, 0);
        this.user.sessionstotal.downloadTotal = tmpVar.value + ' ' + tmpVar.unit
        tmpVar = this.formatBytes(this.user.sessionstotal.uploadTotal, 0);
        this.user.sessionstotal.uploadTotal = tmpVar.value + ' ' + tmpVar.unit
      }
      this.user.loading.sessionstotal = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user last session<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.sessionstotal = false;
      });
    this.$http({
      url: '/api/freeradius/allsessions',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      if (Array.isArray(response.data)) {
        this.user.allsessions.connections = {};
        this.user.allsessions.volume      = {};

        // this.user.allsessions.connections.series = ['Connections', 'Duration'];
        this.user.allsessions.connections.series = ['Duration'];
        this.user.allsessions.connections.labels = [];
        // this.user.allsessions.connections.data = [[], []];
        this.user.allsessions.connections.data = [];
        this.user.allsessions.connections.options = {
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  format: 'MM/DD/YYYY HH:mm',
                  tooltipFormat: 'll HH:mm'
                }
              }
            ]
          }
        };
        this.user.allsessions.connections.datasetOverride = {
          fill: false,
          lineTension: 0
        };

        let displayVolumeUnit = 1024*1024;
        let displayVolumeUnitLabel = 'Mb';

        this.user.allsessions.volume.series = ['Download ('+displayVolumeUnitLabel+')', 'Upload ('+displayVolumeUnitLabel+')'];
        this.user.allsessions.volume.labels = [];
        this.user.allsessions.volume.data = [[], []];
        this.user.allsessions.volume.options = {
          scales: {
            xAxes: [
              {
                // type: "time",
                // time: {
                //   format: 'MM/DD/YYYY HH:mm',
                //   tooltipFormat: 'll HH:mm'
                // }
              }
            ]
          }
        };

        this.user.allsessions.endings.labels = [
          'User-Request',
          'Lost-Carrier',
          'Lost-Service',
          'Idle-Timeout',
          'Session-Timeout',
          'Admin-Reset',
          'Admin-Reboot',
          'Port-Error',
          'NAS-Error',
          'NAS-Request',
          'NAS-Reboot',
          'Port-Unneeded',
          'Port-Preempted',
          'Port-Suspended',
          'Service-Unavailable',
          'Callback',
          'User-Error',
          'Host-Request'];
        this.user.allsessions.endings.data = [];
        for (let i = 0; i < this.user.allsessions.endings.labels.length; i++) this.user.allsessions.endings.data.push(0);
        this.user.allsessions.endings.options = {
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              }
            ],
            xAxes: [
              {
                display: true
              }
            ]
          }
        };

        response.data.forEach(elt => {
          this.user.allsessions.connections.data.push({ x: moment(elt.acctstarttime), y: elt.acctsessiontime});

          this.user.allsessions.volume.data[0].push((elt.acctinputoctets/displayVolumeUnit).toFixed(2));
          this.user.allsessions.volume.data[1].push((elt.acctoutputoctets/displayVolumeUnit).toFixed(2));
          this.user.allsessions.volume.labels.push(moment(elt.acctstarttime).format("MMM D, Y"));

          this.user.allsessions.endings.data[this.user.allsessions.endings.labels.indexOf(elt.acctterminatecause)]++;
        });

        this.user.loading.allsessions = false;
      }
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user last session<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.allsessions = false;
      });
    this.$http({
      url: '/api/freeradius/user/radcheck',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      this.user.radcheck = response.data;
      this.user.radcheckGrid.data = this.user.radcheck;
      this.user.passwordAttributeIndex = this.user.radcheck.findIndex(elt => {
        return elt.attribute.indexOf('-Password') > 0;
      });
      this.updatePasswordAttribute();
      this.user.loading.radcheck = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user check attributes<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.radcheck = false;
      });
    this.$http({
      url: '/api/freeradius/user/radreply',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      this.user.radreply = response.data;
      this.user.radreplyGrid.data = this.user.radreply;
      this.user.loading.radreply = false;
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user reply attributes<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.radreply = false;
      });
    this.$http({
      url: '/api/freeradius/user/userinfo',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
      this.user.userinfo = response.data;
      this.user.loading.userinfo = false;
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user information<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
        this.user.loading.userinfo = false;
      });
    this.updatePasswordAttribute();
  }

  updatePasswordAttribute() {
    if (this.user.passwordAttributeIndex >= 0) {
      this.user.hasPassword = true;
      this.user.passwordClear = this.user.radcheck[this.user.passwordAttributeIndex].value;
      this.user.passwordCheck = this.user.radcheck[this.user.passwordAttributeIndex].value;
    } else {
      this.user.hasPassword = false;
      this.user.passwordAttributeIndex = this.user.radcheck.length;
    }
  }
}

