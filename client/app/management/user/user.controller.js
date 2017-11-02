'use strict';

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
      radcheck: {},
      userinfo: {}
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
    this.user.radcheck = {};
    this.user.passwordAttributeIndex = -1;

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
    })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user check attributes<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      });
    this.$http({
      url: '/api/freeradius/user/userinfo',
      method: "GET",
      params: { username: this.user.username }
    }).then(response => {
        this.user.userinfo = response.data;
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to load user information<br/>Error '+error.status+'<br/>'+error.statusText, 'User edit', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      });
    this.updatePasswordAttribute();
  }

  updatePasswordAttribute() {
    if (this.user.passwordAttributeIndex >= 0) {
      this.user.hasPassword = true;
      this.user.passwordClear = this.user.radcheck[this.user.passwordAttributeIndex].value;
    } else {
      this.user.hasPassword = false;
      this.user.passwordAttributeIndex = this.user.radcheck.length;
    }
  }
}

