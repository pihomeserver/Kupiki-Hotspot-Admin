'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('sysdashboard', {
    url: '/sysdashboard',
    authenticate: true,
    views: {
      navbar: {
        template: '<navbar></navbar>'
      },
      sidebar: {
        template: '<sidebar></sidebar>'
      },
      content: {
        template: require('./sysdashboard/sysdashboard.html'),
        controller: 'SysdashboardController',
        controllerAs: 'vm'
      }
    }
  });

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
          template: require('./sysadmin/sysadmin.html'),
          controller: 'SysadminController',
          controllerAs: 'vm'
        }
      }
    });
}
