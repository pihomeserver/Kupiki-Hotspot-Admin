'use strict';

export default class UserMgmtController {
  /*@ngInject*/
  constructor($http, $stateParams) {
    this.$http = $http;
    this.$stateParams = $stateParams;
  }

  $onInit() {
    console.log(this.$stateParams)
  }
}

