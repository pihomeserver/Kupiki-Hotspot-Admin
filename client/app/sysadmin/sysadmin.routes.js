'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('sysadmin', {
      url: '/sysadmin',
      authenticate: true,
      views: {
        navbar: {
          template: '<navbar></navbar>'
        },
        sidebar: {
          template: '<sidebar></sidebar>'
        },
        content: {
          template: '<sysadmin></sysadmin>'
        }
      }
    });
}
