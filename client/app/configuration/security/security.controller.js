'use strict';

export default class SecurityController {
  /*@ngInject*/
  constructor($scope, $http, toastr, KupikiModal) {
    this.$http = $http;
    this.$scope = $scope;
    this.KupikiModal = KupikiModal;
    this.toastr = toastr;
  }

  $onInit() {
    this.loading = {
      configuration: true
    };
  }
}
