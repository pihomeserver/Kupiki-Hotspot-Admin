'use strict';

export default class UserMgmtController {
  /*@ngInject*/
  constructor($http, $stateParams, toastr) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.toastr = toastr;

    this.user = {
      action: $stateParams.action,
      title: 'Create a new user',
      hasPassword: false,
      passwodType: 'Cleartext',
      radcheck: {},
      userinfo: {}
    };
  }

  saveUserinfo(form) {
    if (form.$valid) {
      this.$http({
        url: '/api/freeradius/user/userinfo',
        method: "POST",
        params: { action: this.user.action, userinfo: this.user.userinfo }
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
        this.toastr.error('Unable to save information<br/>Error '+error.status+'<br/>'+error.statusText, 'Delete user', {
          closeButton: true,
          allowHtml: true,
          timeOut: 0
        });
      });
    }
  }

  $onInit() {
    if (this.$stateParams && this.$stateParams.action && this.$stateParams.action === 'edit' ) {
      this.user.username = this.$stateParams.username;
      this.user.title = 'Edit user';
      this.user.hasPassword = true;
      this.user.hasPassword = true;
      this.$http({
        url: '/api/freeradius/user/radcheck',
        method: "GET",
        params: { username: this.user.username }
      }).then(response => {
        console.log(response.data);
        this.user.radcheck = response.data;
        this.user.radcheckGrid = {
          enableSorting: true,
          rowHeight: 35,

          columnDefs: [
            { displayName: "Attribute", field: 'attribute', pinnedLeft:true, enableHiding: false },
            { displayName: "Operator", field: 'op', enableHiding: false },
            { displayName: "Value", field: 'value', enableHiding: false }
          ],

          data: this.user.radcheck
        };
        this.user.radcheck.passwordAttributeIndex = this.user.radcheck.findIndex(elt => {
          return elt.attribute.indexOf('-Password') > 0;
        });
        // this.user.password = this.user.radcheck[passwordAttributeIndex];
        // console.log(this.user.password)
        // console.log(this.user)
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
    }
  }
}

