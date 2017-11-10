'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  constructor(Auth, $http, $translate) {
    'ngInject';

    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.currentUser = Auth.getCurrentUserSync();
    this.$http = $http;
    this.$translate = $translate;
    this.$translate.use(this.currentUser.language);
  }

  changeLanguage(language) {
    this.$http({
      url: '/api/users/language',
      method: "POST",
      data: {'language': language, '_id': this.currentUser._id }
    }).then(response =>{
      this.currentUser.language = language;
      this.$translate.use(language);
    }).catch(function (error) {
      console.log(error)
    });
  }

  toggleSidebar() {
    angular.element('body').toggleClass('sidebar-hidden');
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
