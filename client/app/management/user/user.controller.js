'use strict';

export default class UserMgmtController {
  /*@ngInject*/
  constructor($http, $stateParams, toastr) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.toastr = toastr;

    this.user = {
      // action: $stateParams.action,
      title: 'Edit user',
      hasPassword: false,
      passwodType: 'Cleartext',
      radcheck: {},
      userinfo: {}
    };
  }

  saveUserRadcheck(form) {
    console.log(form)
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
        { displayName: "Attribute", field: 'attribute', pinnedLeft:true, enableHiding: false },
        { displayName: "Operator", field: 'op', enableHiding: false },
        { displayName: "Value", field: 'value', enableHiding: false }
      ]
    };
    this.user.radcheck = {};
    this.user.passwordAttributeIndex = -1;

    // if (this.$stateParams && this.$stateParams.action && this.$stateParams.action === 'create' ) {}

    // if (this.$stateParams && this.$stateParams.action && this.$stateParams.action === 'edit' ) {
      this.user.username = this.$stateParams.username;
      // this.user.title = 'Edit user';
      this.$http({
        url: '/api/freeradius/user/radcheck',
        method: "GET",
        params: { username: this.user.username }
      }).then(response => {
        // console.log(response.data);
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
    // }
    this.updatePasswordAttribute();
  }

  updatePasswordAttribute() {
    if (this.user.passwordAttributeIndex >= 0) {
      this.user.hasPassword = true;
    } else {
      this.user.hasPassword = false;
      this.user.passwordAttributeIndex = this.user.radcheck.length;
    }
  }
}

