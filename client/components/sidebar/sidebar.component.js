'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class SidebarComponent {
  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.sidebar', [])
  .component('sidebar', {
    template: require('./sidebar.html'),
    controller: SidebarComponent
  })
  .name;
