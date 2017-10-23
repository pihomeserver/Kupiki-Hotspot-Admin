'use strict';

export default class UserMgmtController {
  /*@ngInject*/
  constructor($http, $stateParams, $scope) {
    this.$http = $http;
    this.$stateParams = $stateParams;

    this.user = {
      action: $stateParams.action,
      title: 'Create a new user',
      radcheck: {},
      userinfo: {}
    };
  }

  $onInit() {
    if (this.$stateParams && this.$stateParams.action && this.$stateParams.action === 'edit' ) {
      console.log('Edit user '+this.$stateParams.username);
      this.user.radcheck.username = this.$stateParams.username;
      this.user.title = 'Edit user';
      this.$http({
        url: '/api/freeradius/user/radcheck',
        method: "GET",
        params: {username: this.user.radcheck.username}
      }).then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}

